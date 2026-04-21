import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { BuildObservation, MarkType } from "@/types/database";

export function useBuildObservation(
  userId: string,
  habitId: string,
  date: string,
) {
  return useQuery({
    queryKey: ["build_observation", userId, habitId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("build_observations")
        .select("*")
        .eq("user_id", userId)
        .eq("habit_id", habitId)
        .eq("date", date)
        .maybeSingle();

      if (error) throw error;
      return data as BuildObservation | null;
    },
    enabled: !!userId && !!habitId,
  });
}

export function useUpsertBuildObservation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      habit_id: string;
      date: string;
      sub_type?: string;
      mark_type: MarkType;
      mark_label: string;
      note?: string;
    }) => {
      const { data, error } = await supabase
        .from("build_observations")
        .upsert(
          { user_id: userId, ...payload },
          { onConflict: "habit_id,date" },
        )
        .select()
        .single();

      if (error) throw error;
      return data as BuildObservation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["build_observation", userId, data.habit_id, data.date],
      });
    },
  });
}
