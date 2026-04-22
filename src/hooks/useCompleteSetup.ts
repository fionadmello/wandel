import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { SetupDraft } from "@/types/setup";

async function completeSetup(draft: SetupDraft): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ why_statement: draft.whyStatement, setup_complete: true })
    .eq("id", user.id);
  if (profileError) throw profileError;

  if (draft.qualities.length > 0) {
    const { error } = await supabase.from("profile_qualities").insert(
      draft.qualities.map((value, i) => ({
        user_id: user.id,
        value,
        sort_order: i,
      })),
    );
    if (error) throw error;
  }

  if (draft.reminders.length > 0) {
    const { error } = await supabase.from("profile_reminders").insert(
      draft.reminders.map((value, i) => ({
        user_id: user.id,
        value,
        sort_order: i,
      })),
    );
    if (error) throw error;
  }
}

export function useCompleteSetup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeSetup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
