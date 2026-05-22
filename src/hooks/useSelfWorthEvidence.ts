import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { Evidence } from "@/types/engine";

interface EvidencePayload {
  date: string;
  title: string;
  situation: string;
  what_i_did_well: string;
}

export function useSelfWorthEvidence(userId: string) {
  return useQuery({
    queryKey: ["self_worth_evidence", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("self_worth_evidence")
        .select("*")
        .eq("user_id", userId)
        .eq("archived", false)
        .order("timestamp", { ascending: false });
      if (error) throw error;
      return data as Evidence[];
    },
    enabled: !!userId,
  });
}

export function useAddEvidence(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EvidencePayload) => {
      const { data, error } = await supabase
        .from("self_worth_evidence")
        .insert({ user_id: userId, ...payload })
        .select()
        .single();
      if (error) throw error;
      return data as Evidence;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["self_worth_evidence", userId],
      });
    },
  });
}
