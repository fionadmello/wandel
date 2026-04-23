import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Habit, HabitStatus, HabitWithConfigs } from "@/types/database";
import type { JobOption } from "@/types/setup";

export function useBreakHabits(userId: string) {
  return useQuery({
    queryKey: ["break_habits", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*, configs:habit_configs(*)")
        .eq("user_id", userId)
        .eq("category", "break")
        .order("sort_order");

      if (error) throw error;
      return data as HabitWithConfigs[];
    },
    enabled: !!userId,
  });
}

export function useBreakHabit(userId: string, habitId: string) {
  return useQuery({
    queryKey: ["break_habit", userId, habitId],
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

export function useAddBreakHabit(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      jobs: JobOption[];
      status?: HabitStatus;
    }) => {
      const { data: habit, error: habitError } = await supabase
        .from("habits")
        .insert({
          user_id: userId,
          category: "break",
          name: payload.name,
          status: payload.status ?? "active",
        })
        .select()
        .single();

      if (habitError) throw habitError;

      if (payload.jobs.length > 0) {
        const { error: configError } = await supabase
          .from("habit_configs")
          .insert(
            payload.jobs.map((job, i) => ({
              habit_id: (habit as Habit).id,
              key: "job",
              value: job.name,
              sub_type: job.description,
              sort_order: i,
            })),
          );

        if (configError) throw configError;
      }

      return habit as Habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["break_habits", userId] });
    },
  });
}
