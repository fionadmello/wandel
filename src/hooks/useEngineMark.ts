import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";

import { supabase } from "@/lib/supabase";
import type { EngineMark, ProtocolType } from "@/types/database";

export function useEngineMark(userId: string, date: string) {
  return useQuery({
    queryKey: ["engine_mark", userId, date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engine_marks")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .maybeSingle();

      if (error) throw error;
      return data as EngineMark | null;
    },
    enabled: !!userId,
  });
}

export function useUpsertEngineMark(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      date: string;
      timer_completed: boolean;
      confirmed_at: string;
    }) => {
      const { data, error } = await supabase
        .from("engine_marks")
        .upsert({ user_id: userId, ...payload }, { onConflict: "user_id,date" })
        .select()
        .single();

      if (error) throw error;
      return data as EngineMark;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({
        queryKey: ["engine_mark", userId, data.date],
      });

      try {
        // Write deferred standing_up when mirror is logged after a completed protocol
        const { data: recentProtocol } = await supabase
          .from("slip_drift_log")
          .select("triggered_at, type")
          .eq("user_id", userId)
          .eq("track_type", "engine")
          .eq("protocol_completed", true)
          .in("type", ["slip", "drift"])
          .order("triggered_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!recentProtocol) return;

        const fallDate = recentProtocol.triggered_at.slice(0, 10);
        if (fallDate > data.date) return;

        const { data: existing } = await supabase
          .from("standing_up_log")
          .select("id")
          .eq("user_id", userId)
          .is("habit_id", null)
          .gte("return_date", fallDate)
          .limit(1)
          .maybeSingle();

        if (existing) return;

        await supabase.from("standing_up_log").insert({
          user_id: userId,
          habit_id: null,
          track_type: "engine",
          track_name: "Mirror",
          protocol: recentProtocol.type as ProtocolType,
          fall_date: fallDate,
          return_date: data.date,
          gap_days: differenceInDays(new Date(data.date), new Date(fallDate)),
        });

        queryClient.invalidateQueries({
          queryKey: ["standing_up_log", userId],
        });
      } catch {
        // Standing up write is best-effort; don't fail the mutation
      }
    },
  });
}
