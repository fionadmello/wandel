import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Habit, HabitStatus, HabitWithConfigs } from "@/types/database";

export interface SubTypeConfig {
  subType: string | null;
  anchor: string;
  nonNegotiable: string;
  minimumVersion: string;
  fullVersion: string;
}

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
      configs: SubTypeConfig[];
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

      const rows = payload.configs.flatMap((cfg, cfgIdx) =>
        [
          { key: "anchor", value: cfg.anchor },
          { key: "non_negotiable", value: cfg.nonNegotiable },
          { key: "minimum_version", value: cfg.minimumVersion },
          { key: "full_version", value: cfg.fullVersion },
        ].map((row, rowIdx) => ({
          habit_id: (habit as Habit).id,
          key: row.key,
          value: row.value,
          sub_type: cfg.subType,
          sort_order: cfgIdx * 4 + rowIdx,
        })),
      );

      if (rows.length > 0) {
        const { error: configError } = await supabase
          .from("habit_configs")
          .insert(rows);

        if (configError) throw configError;
      }

      return habit as Habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["build_habits", userId] });
    },
  });
}

export function useAddBuildSubType(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      habitId: string;
      subType: string;
      anchor: string;
      nonNegotiable: string;
      minimumVersion: string;
      fullVersion: string;
    }) => {
      const { error } = await supabase.from("habit_configs").insert([
        {
          habit_id: payload.habitId,
          key: "anchor",
          value: payload.anchor,
          sub_type: payload.subType,
          sort_order: 0,
        },
        {
          habit_id: payload.habitId,
          key: "non_negotiable",
          value: payload.nonNegotiable,
          sub_type: payload.subType,
          sort_order: 1,
        },
        {
          habit_id: payload.habitId,
          key: "minimum_version",
          value: payload.minimumVersion,
          sub_type: payload.subType,
          sort_order: 2,
        },
        {
          habit_id: payload.habitId,
          key: "full_version",
          value: payload.fullVersion,
          sub_type: payload.subType,
          sort_order: 3,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({
        queryKey: ["build_habit", userId, habitId],
      });
      queryClient.invalidateQueries({ queryKey: ["build_habits", userId] });
    },
  });
}

export function useUpdateBuildSubType(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      habitId: string;
      subType: string | null;
      anchor: string;
      nonNegotiable: string;
      minimumVersion: string;
      fullVersion: string;
    }) => {
      const deleteQuery = supabase
        .from("habit_configs")
        .delete()
        .eq("habit_id", payload.habitId);

      const { error: deleteError } =
        payload.subType === null
          ? await deleteQuery.is("sub_type", null)
          : await deleteQuery.eq("sub_type", payload.subType);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("habit_configs")
        .insert([
          {
            habit_id: payload.habitId,
            key: "anchor",
            value: payload.anchor,
            sub_type: payload.subType,
            sort_order: 0,
          },
          {
            habit_id: payload.habitId,
            key: "non_negotiable",
            value: payload.nonNegotiable,
            sub_type: payload.subType,
            sort_order: 1,
          },
          {
            habit_id: payload.habitId,
            key: "minimum_version",
            value: payload.minimumVersion,
            sub_type: payload.subType,
            sort_order: 2,
          },
          {
            habit_id: payload.habitId,
            key: "full_version",
            value: payload.fullVersion,
            sub_type: payload.subType,
            sort_order: 3,
          },
        ]);

      if (insertError) throw insertError;
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({
        queryKey: ["build_habit", userId, habitId],
      });
      queryClient.invalidateQueries({ queryKey: ["build_habits", userId] });
    },
  });
}

export function useDeleteBuildSubType(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { habitId: string; subType: string }) => {
      const { error } = await supabase
        .from("habit_configs")
        .delete()
        .eq("habit_id", payload.habitId)
        .eq("sub_type", payload.subType);

      if (error) throw error;
    },
    onSuccess: (_, { habitId }) => {
      queryClient.invalidateQueries({
        queryKey: ["build_habit", userId, habitId],
      });
      queryClient.invalidateQueries({ queryKey: ["build_habits", userId] });
    },
  });
}
