import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useStandingUpEntries(
  userId: string,
  trackType: TrackType,
  habitId?: string | null,
) {
  return useQuery({
    queryKey: ["standing_up_log", userId, trackType, habitId ?? null],
    queryFn: async () => {
      const base = supabase
        .from("standing_up_log")
        .select("*")
        .eq("user_id", userId)
        .eq("track_type", trackType);

      const { data, error } = await (
        habitId ? base.eq("habit_id", habitId) : base
      ).order("return_date", { ascending: false });

      if (error) throw error;
      return data as StandingUpEntry[];
    },
    enabled: !!userId,
  });
}

export function useAllStandingUpEntries(userId: string) {
  return useQuery({
    queryKey: ["standing_up_log", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("standing_up_log")
        .select("*")
        .eq("user_id", userId)
        .order("return_date", { ascending: false });
      if (error) throw error;
      return data as StandingUpEntry[];
    },
    enabled: !!userId,
  });
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
