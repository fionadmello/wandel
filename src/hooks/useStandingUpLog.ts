import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type {
  ProtocolType,
  StandingUpEntry,
  TrackType,
} from "@/types/database";

interface StandingUpPayload {
  track_type: TrackType;
  track_name: string;
  protocol: ProtocolType;
  habit_id: string | null;
  gap_days: number;
  fall_date: string;
  return_date: string;
}

export function useLogStandingUp(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: StandingUpPayload) => {
      const { data, error } = await supabase
        .from("standing_up_log")
        .insert({ user_id: userId, ...payload })
        .select()
        .single();
      if (error) throw error;
      return data as StandingUpEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["standing_up_log", userId] });
    },
  });
}
