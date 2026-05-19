import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { WeeklyReviewWithHabits } from "@/types/database";

export function useWeeklyReviewHistory(userId: string) {
  return useQuery({
    queryKey: ["weekly_review_history", userId],
    queryFn: async (): Promise<WeeklyReviewWithHabits[]> => {
      const { data, error } = await supabase
        .from("weekly_reviews")
        .select("*, habit_reviews:weekly_review_habits(*)")
        .eq("user_id", userId)
        .order("week_ending", { ascending: false });

      if (error) throw error;
      return (data ?? []) as WeeklyReviewWithHabits[];
    },
    enabled: !!userId,
  });
}
