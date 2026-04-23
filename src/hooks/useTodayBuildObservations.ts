import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { supabase } from "@/lib/supabase";
import type { BuildObservation } from "@/types/database";

export function useTodayBuildObservations(userId: string) {
  const today = format(new Date(), "yyyy-MM-dd");
  return useQuery({
    queryKey: ["build_observations_today", userId, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("build_observations")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today);

      if (error) throw error;
      return data as BuildObservation[];
    },
    enabled: !!userId,
  });
}
