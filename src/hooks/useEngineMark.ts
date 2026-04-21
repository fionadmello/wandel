import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { EngineMark } from "@/types/database";

export function useEngineMark(userId: string, date: string) {
  return useQuery({
    queryKey: ["engine_mark", userId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engine_marks")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .maybeSingle();

      if (error) throw error;
      return data as EngineMark | null;
    },
    enabled: !!userId,
  });
}

export function useUpsertEngineMark(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      date: string;
      timer_completed: boolean;
      confirmed_at: string;
    }) => {
      const { data, error } = await supabase
        .from("engine_marks")
        .upsert({ user_id: userId, ...payload }, { onConflict: "user_id,date" })
        .select()
        .single();

      if (error) throw error;
      return data as EngineMark;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["engine_mark", userId, data.date],
      });
    },
  });
}
