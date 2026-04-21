import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type {
  Profile,
  ProfileQuality,
  ProfileReminder,
  ProfileUpdate,
} from "@/types/database";

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
  });
}

export function useProfileQualities(userId: string) {
  return useQuery({
    queryKey: ["profile_qualities", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_qualities")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order");

      if (error) throw error;
      return data as ProfileQuality[];
    },
    enabled: !!userId,
  });
}

export function useProfileReminders(userId: string) {
  return useQuery({
    queryKey: ["profile_reminders", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_reminders")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order");

      if (error) throw error;
      return data as ProfileReminder[];
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
