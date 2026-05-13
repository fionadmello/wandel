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

export function usePendingProtocols(userId: string) {
  return useQuery({
    queryKey: ["pending_protocols", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pending_protocols")
        .select("*")
        .eq("user_id", userId)
        .order("created_at");
      if (error) throw error;
      return (data as PendingProtocolRow[]).map(fromRow);
    },
    enabled: !!userId,
  });
}

export function useSetPendingProtocols(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (protocols: PendingProtocol[]) => {
      if (protocols.length === 0) return;
      const { error } = await supabase.from("pending_protocols").upsert(
        protocols.map((p) => ({
          user_id: userId,
          protocol_id: p.id,
          habit_id: p.habitId,
          track_type: p.trackType,
          track_name: p.trackName,
          drift_days: p.driftDays,
          current_step: p.currentStep,
        })),
        { onConflict: "user_id,track_key" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending_protocols", userId],
      });
    },
  });
}

export function useClearPendingProtocol(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (protocol: PendingProtocol) => {
      const trackKey = protocol.habitId ?? protocol.id;
      const { error } = await supabase
        .from("pending_protocols")
        .delete()
        .eq("user_id", userId)
        .eq("track_key", trackKey);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending_protocols", userId],
      });
    },
  });
}
