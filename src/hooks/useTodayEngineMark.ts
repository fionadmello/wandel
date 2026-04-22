import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { supabase } from "@/lib/supabase";
import type { EngineMark } from "@/types/database";

export function useTodayEngineMark(userId: string) {
  const today = format(new Date(), "yyyy-MM-dd");
  return useQuery({
    queryKey: ["engine_marks", userId, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engine_marks")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .maybeSingle();
      if (error) throw error;
      return data as EngineMark | null;
    },
    enabled: !!userId,
  });
}
