import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DEFAULT_PRACTICES } from "@/constants/defaultPractices";
import { supabase } from "@/lib/supabase";
import type { Practice } from "@/types/engine";

interface SavePracticePayload {
  id: string;
  name: string;
  description: string;
  is_default: boolean;
  active: boolean;
}

export function usePractices(userId: string) {
  return useQuery({
    queryKey: ["practice_collection", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("practice_collection")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Practice[];
    },
    enabled: !!userId,
  });
}

export function useSeedDefaultPractices(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const practices = DEFAULT_PRACTICES.map((practice) => ({
        id: crypto.randomUUID(),
        user_id: userId,
        ...practice,
      }));
      const { error } = await supabase
        .from("practice_collection")
        .upsert(practices, {
          onConflict: "user_id,name",
          ignoreDuplicates: true,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["practice_collection", userId],
      });
    },
  });
}

export function useSavePractice(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SavePracticePayload) => {
      const { data, error } = await supabase
        .from("practice_collection")
        .upsert({ user_id: userId, ...payload })
        .select()
        .single();
      if (error) throw error;
      return data as Practice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["practice_collection", userId],
      });
    },
  });
}

export function useDeletePractice(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("practice_collection")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["practice_collection", userId],
      });
    },
  });
}
