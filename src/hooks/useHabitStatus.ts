import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Habit, HabitStatus } from "@/types/database";

export function useUpdateHabitStatus(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { habitId: string; status: HabitStatus }) => {
      const paused_at =
        payload.status === "paused" ? new Date().toISOString() : null;

      const { data, error } = await supabase
        .from("habits")
        .update({ status: payload.status, paused_at })
        .eq("id", payload.habitId)
        .select()
        .single();

      if (error) throw error;
      return data as Habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["break_habits", userId] });
    },
  });
}

export function useResetBreakHabit(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (habitId: string) => {
      const { error: deleteError } = await supabase
        .from("break_observations")
        .delete()
        .eq("habit_id", habitId);

      if (deleteError) throw deleteError;

      const { data, error } = await supabase
        .from("habits")
        .update({ status: "active", paused_at: null })
        .eq("id", habitId)
        .select()
        .single();

      if (error) throw error;
      return data as Habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["break_habits", userId] });
      queryClient.invalidateQueries({
        queryKey: ["break_observations", userId],
      });
    },
  });
}
