import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

export interface SettingsUpdate {
  userId: string;
  whyStatement: string;
  qualities: string[];
  reminders: string[];
}

async function updateSettings({
  userId,
  whyStatement,
  qualities,
  reminders,
}: SettingsUpdate): Promise<void> {
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ why_statement: whyStatement })
    .eq("id", userId);
  if (profileError) throw profileError;

  const { error: deleteQualitiesError } = await supabase
    .from("profile_qualities")
    .delete()
    .eq("user_id", userId);
  if (deleteQualitiesError) throw deleteQualitiesError;

  if (qualities.length > 0) {
    const { error } = await supabase
      .from("profile_qualities")
      .insert(
        qualities.map((value, i) => ({
          user_id: userId,
          value,
          sort_order: i,
        })),
      );
    if (error) throw error;
  }

  const { error: deleteRemindersError } = await supabase
    .from("profile_reminders")
    .delete()
    .eq("user_id", userId);
  if (deleteRemindersError) throw deleteRemindersError;

  if (reminders.length > 0) {
    const { error } = await supabase
      .from("profile_reminders")
      .insert(
        reminders.map((value, i) => ({
          user_id: userId,
          value,
          sort_order: i,
        })),
      );
    if (error) throw error;
  }
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({
        queryKey: ["profile_qualities", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile_reminders", userId],
      });
    },
  });
}
