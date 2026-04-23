import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { JobOption } from "@/types/setup";

export function useUpdateHabitJobs(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { habitId: string; jobs: JobOption[] }) => {
      const { error: deleteError } = await supabase
        .from("habit_configs")
        .delete()
        .eq("habit_id", payload.habitId)
        .eq("key", "job");

      if (deleteError) throw deleteError;

      if (payload.jobs.length > 0) {
        const { error: insertError } = await supabase
          .from("habit_configs")
          .insert(
            payload.jobs.map((job, i) => ({
              habit_id: payload.habitId,
              key: "job",
              value: job.name,
              sub_type: job.description,
              sort_order: i,
            })),
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["break_habits", userId] });
    },
  });
}
