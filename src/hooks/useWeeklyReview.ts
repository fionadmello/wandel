import { useQuery } from "@tanstack/react-query";
import { endOfWeek, format } from "date-fns";

import { supabase } from "@/lib/supabase";
import type { WeeklyReview } from "@/types/database";

export function currentWeekEnding(today: Date = new Date()): string {
  return format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
}

export function useWeeklyReview(userId: string, date?: Date) {
  const weekEnding = currentWeekEnding(date);

  return useQuery({
    queryKey: ["weekly_review", userId, weekEnding],
    queryFn: async (): Promise<WeeklyReview | null> => {
      const { data, error } = await supabase
        .from("weekly_reviews")
        .select("*")
        .eq("user_id", userId)
        .eq("week_ending", weekEnding)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
