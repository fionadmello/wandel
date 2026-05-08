import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

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

export function useHabitDayObservations(
  userId: string,
  habitId: string,
  date?: string,
) {
  const effectiveDate = date ?? format(new Date(), "yyyy-MM-dd");
  return useQuery({
    queryKey: ["build_observations_day", userId, habitId, effectiveDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("build_observations")
        .select("*")
        .eq("user_id", userId)
        .eq("habit_id", habitId)
        .eq("date", effectiveDate);

      if (error) throw error;
      return data as BuildObservation[];
    },
    enabled: !!userId && !!habitId,
  });
}

export function useUpsertBuildObservation(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      id?: string;
      habit_id: string;
      date: string;
      sub_type?: string | null;
      mark_type: MarkType;
      mark_label: string;
      note?: string;
    }) => {
      const { id, ...fields } = payload;

      if (id) {
        const { data, error } = await supabase
          .from("build_observations")
          .update({
            mark_type: fields.mark_type,
            mark_label: fields.mark_label,
            note: fields.note ?? null,
          })
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        return data as BuildObservation;
      }

      const { data, error } = await supabase
        .from("build_observations")
        .insert({ user_id: userId, ...fields })
        .select()
        .single();
      if (error) throw error;
      return data as BuildObservation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["build_observations_day", userId, data.habit_id, data.date],
      });
      queryClient.invalidateQueries({
        queryKey: ["build_observation", userId, data.habit_id, data.date],
      });
    },
  });
}
