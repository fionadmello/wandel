import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Habit, HabitStatus, HabitWithConfigs } from "@/types/database";

export function useBuildHabits(userId: string) {
  return useQuery({
    queryKey: ["build_habits", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*, configs:habit_configs(*)")
        .eq("user_id", userId)
        .eq("category", "build")
        .order("sort_order");

      if (error) throw error;
      return data as HabitWithConfigs[];
    },
    enabled: !!userId,
  });
}

export function useBuildHabit(userId: string, habitId: string) {
  return useQuery({
    queryKey: ["build_habit", userId, habitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*, configs:habit_configs(*)")
        .eq("user_id", userId)
        .eq("id", habitId)
        .single();

      if (error) throw error;
      return data as HabitWithConfigs;
    },
    enabled: !!userId && !!habitId,
  });
}

export function useAddBuildHabit(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      anchor: string;
      nonNegotiable: string;
      minimumVersion: string;
      fullVersion: string;
      status?: HabitStatus;
    }) => {
      const { data: habit, error: habitError } = await supabase
        .from("habits")
        .insert({
          user_id: userId,
          category: "build",
          name: payload.name,
          status: payload.status ?? "active",
        })
        .select()
        .single();

      if (habitError) throw habitError;

      const configs = [
        { key: "anchor", value: payload.anchor },
        { key: "non_negotiable", value: payload.nonNegotiable },
        { key: "minimum_version", value: payload.minimumVersion },
        { key: "full_version", value: payload.fullVersion },
      ];

      const { error: configError } = await supabase
        .from("habit_configs")
        .insert(
          configs.map((c, i) => ({
            habit_id: (habit as Habit).id,
            ...c,
            sort_order: i,
          })),
        );

      if (configError) throw configError;

      return habit as Habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["build_habits", userId] });
    },
  });
}

export function useUpdateBuildHabitConfig(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      habitId: string;
      anchor: string;
      nonNegotiable: string;
      minimumVersion: string;
      fullVersion: string;
    }) => {
      const { error: deleteError } = await supabase
        .from("habit_configs")
        .delete()
        .eq("habit_id", payload.habitId);

      if (deleteError) throw deleteError;

      const configs = [
        { key: "anchor", value: payload.anchor },
        { key: "non_negotiable", value: payload.nonNegotiable },
        { key: "minimum_version", value: payload.minimumVersion },
        { key: "full_version", value: payload.fullVersion },
      ];

      const { error: insertError } = await supabase
        .from("habit_configs")
        .insert(
          configs.map((c, i) => ({
            habit_id: payload.habitId,
            ...c,
            sort_order: i,
          })),
        );

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["build_habits", userId] });
      queryClient.invalidateQueries({ queryKey: ["build_habit", userId] });
    },
  });
}
