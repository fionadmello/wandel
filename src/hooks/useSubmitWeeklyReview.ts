import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import type { SubmitWeeklyReviewPayload } from "@/types/review";

export function useSubmitWeeklyReview(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitWeeklyReviewPayload) => {
      const { data: review, error: reviewError } = await supabase
        .from("weekly_reviews")
        .insert({
          user_id: userId,
          week_ending: payload.weekEnding,
          engine_response: payload.engineResponse,
          pride_note: payload.prideNote,
          self_rated_consistency: payload.selfRatedConsistency,
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      const habitRows = payload.habitResponses.map((h) => ({
        review_id: review.id,
        habit_id: h.habitId,
        what_done: h.whatDone,
        what_got_in_way: h.whatGotInWay,
        adjustment: h.adjustment,
      }));

      if (habitRows.length > 0) {
        const { error: habitsError } = await supabase
          .from("weekly_review_habits")
          .insert(habitRows);

        if (habitsError) throw habitsError;
      }

      return review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly_review"] });
      queryClient.invalidateQueries({ queryKey: ["weekly_review_history"] });
    },
  });
}
