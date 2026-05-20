import { format, isSunday, parseISO } from "date-fns";

import { useWeeklyConsistency } from "@/hooks/useWeeklyConsistency";
import { mostRecentSunday } from "@/hooks/useWeeklyReview";
import { useWeeklyReviewHistory } from "@/hooks/useWeeklyReviewHistory";
import type { Habit } from "@/types/database";

interface ReviewSummaryProps {
  userId: string;
  breakHabits: Habit[];
  buildHabits: Habit[];
  onStartReview: () => void;
}

export function ReviewSummary({
  userId,
  breakHabits,
  buildHabits,
  onStartReview,
}: ReviewSummaryProps) {
  const weekEnding = mostRecentSunday();
  const isSundayToday = isSunday(new Date());

  const historyQuery = useWeeklyReviewHistory(userId);
  const allReviews = historyQuery.data ?? [];
  const thisWeek = allReviews.find((r) => r.week_ending === weekEnding) ?? null;
  const pastReviews = allReviews.filter((r) => r.week_ending !== weekEnding);

  const consistencyQuery = useWeeklyConsistency(
    userId,
    thisWeek ? weekEnding : "",
  );
  const consistencyData = thisWeek ? consistencyQuery.data : undefined;

  const allHabits = [...breakHabits, ...buildHabits];
  const habitById = Object.fromEntries(allHabits.map((h) => [h.id, h]));

  return (
    <div className="flex flex-col gap-8">
      {!thisWeek && (
        <button
          type="button"
          onClick={onStartReview}
          className="font-serif italic text-[17px] text-plum text-left leading-snug"
        >
          {isSundayToday
            ? "Start this week's review →"
            : `Review week ending ${format(parseISO(weekEnding), "d MMM")} →`}
        </button>
      )}

      {thisWeek && (
        <div className="flex flex-col gap-4">
          <p className="font-sans text-xs text-muted uppercase tracking-wide">
            This week · {format(parseISO(thisWeek.week_ending), "d MMM")}
          </p>

          {thisWeek.engine_response && (
            <div className="flex flex-col gap-1">
              <p className="font-sans text-xs text-muted">Mirror</p>
              <p className="font-sans text-sm text-soft">
                {thisWeek.engine_response}
              </p>
            </div>
          )}

          {thisWeek.pride_note && (
            <div className="flex flex-col gap-1">
              <p className="font-sans text-xs text-muted">Standing up</p>
              <p className="font-sans text-sm text-soft">
                {thisWeek.pride_note}
              </p>
            </div>
          )}

          {thisWeek.habit_reviews.map((hr) => {
            const habit = habitById[hr.habit_id];
            if (!habit) return null;
            return (
              <div key={hr.id} className="flex flex-col gap-1">
                <p className="font-sans text-xs text-muted">{habit.name}</p>
                {hr.what_done && (
                  <p className="font-sans text-sm text-soft">{hr.what_done}</p>
                )}
              </div>
            );
          })}

          {thisWeek.self_rated_consistency !== null && (
            <div className="flex flex-col gap-1">
              <p className="font-sans text-xs text-muted">Consistency</p>
              <p className="font-sans text-sm text-soft">
                Self-rated {thisWeek.self_rated_consistency}/5
              </p>
              {consistencyData && (
                <div className="flex flex-col gap-0.5 mt-1">
                  <p className="font-sans text-xs text-muted">
                    Mirror — {consistencyData.engineMarked}/7 days
                  </p>
                  {buildHabits.map((h) => (
                    <p key={h.id} className="font-sans text-xs text-muted">
                      {h.name} —{" "}
                      {consistencyData.buildObsDaysByHabit[h.id] ?? 0}/7 days
                    </p>
                  ))}
                  {breakHabits.map((h) => (
                    <p key={h.id} className="font-sans text-xs text-muted">
                      {h.name} —{" "}
                      {7 - (consistencyData.breakObsDaysByHabit[h.id] ?? 0)}/7
                      clean days
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {pastReviews.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="font-sans text-xs text-muted uppercase tracking-wide">
            Past reviews
          </p>
          {pastReviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-1">
              <p className="font-sans text-sm text-soft">
                {format(parseISO(review.week_ending), "d MMM yyyy")}
                {review.self_rated_consistency !== null &&
                  ` · ${review.self_rated_consistency}/5`}
              </p>
              {review.engine_response && (
                <p className="font-sans text-xs text-muted line-clamp-2">
                  {review.engine_response}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {historyQuery.isLoading && (
        <p className="font-sans text-xs text-muted">Loading…</p>
      )}
    </div>
  );
}
