import { useMutation } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { ProtocolType, SlipDriftEntry, TrackType } from "@/types/database";

interface SlipDriftPayload {
  track_type: TrackType;
  type: ProtocolType;
  habit_id?: string | null;
  job_id?: string | null;
  cause_category?: "distress_tolerance" | "logistics" | "emotional_load" | null;
  emotional_state_before?: string | null;
  all_or_nothing_stage?: string | null;
  protocol_completed?: boolean;
}

export function useLogSlipDrift(userId: string) {
  return useMutation({
    mutationFn: async (payload: SlipDriftPayload) => {
      const { data, error } = await supabase
        .from("slip_drift_log")
        .insert({ user_id: userId, ...payload })
        .select()
        .single();
      if (error) throw error;
      return data as SlipDriftEntry;
    },
  });
}
