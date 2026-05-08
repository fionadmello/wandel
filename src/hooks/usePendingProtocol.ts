import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { PendingProtocolRow } from "@/types/database";
import type { PendingProtocol } from "@/types/protocols";

function fromRow(row: PendingProtocolRow): PendingProtocol {
  return {
    id: row.protocol_id,
    habitId: row.habit_id,
    trackType: row.track_type,
    trackName: row.track_name,
    driftDays: row.drift_days,
    currentStep: row.current_step,
  };
}

export function usePendingProtocol(userId: string) {
  return useQuery({
    queryKey: ["pending_protocol", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pending_protocols")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data ? fromRow(data as PendingProtocolRow) : null;
    },
    enabled: !!userId,
  });
}

export function useSetPendingProtocol(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (protocol: PendingProtocol) => {
      const { error } = await supabase.from("pending_protocols").upsert(
        {
          user_id: userId,
          protocol_id: protocol.id,
          habit_id: protocol.habitId,
          track_type: protocol.trackType,
          track_name: protocol.trackName,
          drift_days: protocol.driftDays,
          current_step: protocol.currentStep,
        },
        { onConflict: "user_id" },
      );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending_protocol", userId] });
    },
  });
}

export function useClearPendingProtocol(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("pending_protocols")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending_protocol", userId] });
    },
  });
}
