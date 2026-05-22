import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { DailyIntention } from "@/types/engine";

interface DailyIntentionPayload {
  date: string;
  hard_task: string | null;
}

export function useDailyIntention(userId: string, date: string) {
  return useQuery({
    queryKey: ["daily_intention", userId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_intentions")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .maybeSingle();

      if (error) throw error;
      return data as DailyIntention | null;
    },
    enabled: !!userId && !!date,
  });
}

export function useUpsertDailyIntention(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DailyIntentionPayload) => {
      const { data, error } = await supabase
        .from("daily_intentions")
        .upsert(
          { user_id: userId, ...payload, updated_at: new Date().toISOString() },
          { onConflict: "user_id,date" },
        )
        .select()
        .single();

      if (error) throw error;
      return data as DailyIntention;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["daily_intention", userId, data.date],
      });
    },
  });
}
