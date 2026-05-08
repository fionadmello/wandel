import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { useMemo } from "react";

import {
  detectEngineDrift,
  detectHabitDrift,
} from "@/features/protocols/detectProtocol";
import { useBreakHabits } from "@/hooks/useBreakHabits";
import { useBuildHabits } from "@/hooks/useBuildHabits";
import { usePendingProtocol } from "@/hooks/usePendingProtocol";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/database";
import type { PendingProtocol } from "@/types/protocols";

export function useProtocolDetection(
  userId: string,
  profile: Profile | undefined,
): { protocol: PendingProtocol | null; isChecking: boolean } {
  const today = format(new Date(), "yyyy-MM-dd");
  const alreadyChecked = profile?.last_protocol_check === today;

  const { data: pending, isSuccess: pendingLoaded } =
    usePendingProtocol(userId);

  const shouldDetect =
    !!userId && !alreadyChecked && pendingLoaded && pending === null;

  const { data: breakHabits = [] } = useBreakHabits(userId);
  const { data: buildHabits = [] } = useBuildHabits(userId);

  const since = format(subDays(new Date(), 10), "yyyy-MM-dd");

  const { data: engineMarks = [], isLoading: engineLoading } = useQuery({
    queryKey: ["engine_marks_recent", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engine_marks")
        .select("date")
        .eq("user_id", userId)
        .gte("date", since);
      if (error) throw error;
      return (data ?? []) as { date: string }[];
    },
    enabled: shouldDetect,
  });

  const hasActiveBreak = breakHabits.some((h) => h.status === "active");
  const hasActiveBuild = buildHabits.some((h) => h.status === "active");

  const { data: breakObsRecent = [], isLoading: breakObsLoading } = useQuery({
    queryKey: ["break_obs_recent", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("break_observations")
        .select("habit_id, logged_at")
        .eq("user_id", userId)
        .gte("logged_at", `${since}T00:00:00.000Z`);
      if (error) throw error;
      return (data ?? []) as { habit_id: string; logged_at: string }[];
    },
    enabled: shouldDetect && hasActiveBreak,
  });

  const { data: buildObsRecent = [], isLoading: buildObsLoading } = useQuery({
    queryKey: ["build_obs_recent", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("build_observations")
        .select("habit_id, date")
        .eq("user_id", userId)
        .gte("date", since);
      if (error) throw error;
      return (data ?? []) as { habit_id: string; date: string }[];
    },
    enabled: shouldDetect && hasActiveBuild,
  });

  const isChecking =
    !alreadyChecked &&
    (!pendingLoaded ||
      (shouldDetect && (engineLoading || breakObsLoading || buildObsLoading)));

  const protocol = useMemo(() => {
    if (alreadyChecked || !pendingLoaded) return null;
    if (pending !== null) return pending;
    if (engineLoading || breakObsLoading || buildObsLoading) return null;

    const allActive = [...breakHabits, ...buildHabits].filter(
      (h) => h.status === "active",
    );

    const breakObsByDate = new Map<string, Set<string>>();
    breakObsRecent.forEach((o) => {
      const date = o.logged_at.slice(0, 10);
      if (!breakObsByDate.has(date)) breakObsByDate.set(date, new Set());
      breakObsByDate.get(date)!.add(o.habit_id);
    });

    const buildObsByDate = new Map<string, Set<string>>();
    buildObsRecent.forEach((o) => {
      if (!buildObsByDate.has(o.date)) buildObsByDate.set(o.date, new Set());
      buildObsByDate.get(o.date)!.add(o.habit_id);
    });

    const habitDrift = detectHabitDrift(
      allActive,
      breakObsByDate,
      buildObsByDate,
      today,
    );
    if (habitDrift) return habitDrift;

    return detectEngineDrift(new Set(engineMarks.map((m) => m.date)), today);
  }, [
    alreadyChecked,
    pendingLoaded,
    pending,
    engineLoading,
    breakObsLoading,
    buildObsLoading,
    breakHabits,
    buildHabits,
    breakObsRecent,
    buildObsRecent,
    engineMarks,
    today,
  ]);

  return { protocol, isChecking };
}
