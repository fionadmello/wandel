import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { supabase } from "@/lib/supabase";

export function useSignOut() {
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: async () => {
      await router.invalidate();
    },
  });
}
