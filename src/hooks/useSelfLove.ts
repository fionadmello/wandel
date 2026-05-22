import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { SelfLoveEntry } from "@/types/engine";

interface SelfLovePayload {
  date: string;
  practice: string;
  practice_id: string;
  felt: number;
  note?: string | null;
}

export function useSelfLoveEntries(userId: string) {
  return useQuery({
    queryKey: ["self_love_log", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("self_love_log")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });
      if (error) throw error;
      return data as SelfLoveEntry[];
    },
    enabled: !!userId,
  });
}

export function useLogSelfLove(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SelfLovePayload) => {
      const { data, error } = await supabase
        .from("self_love_log")
        .insert({ user_id: userId, ...payload })
        .select()
        .single();
      if (error) throw error;
      return data as SelfLoveEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["self_love_log", userId] });
    },
  });
}
