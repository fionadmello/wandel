import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { HardThing } from "@/types/engine";

interface HardThingPayload {
  date: string;
  what: string;
  before: number;
  during: number;
  after: number;
  note?: string | null;
  linked_intention?: boolean;
}

export function useHardThings(userId: string) {
  return useQuery({
    queryKey: ["hard_things_log", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hard_things_log")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });
      if (error) throw error;
      return data as HardThing[];
    },
    enabled: !!userId,
  });
}

export function useLogHardThing(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: HardThingPayload) => {
      const { data, error } = await supabase
        .from("hard_things_log")
        .insert({ user_id: userId, ...payload })
        .select()
        .single();
      if (error) throw error;
      return data as HardThing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hard_things_log", userId] });
    },
  });
}
