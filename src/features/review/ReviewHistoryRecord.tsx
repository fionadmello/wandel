import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { Habit, WeeklyReviewWithHabits } from "@/types/database";
import type { WeeklyConsistencyData } from "@/types/review";

interface ReviewHistoryRecordProps {
  review: WeeklyReviewWithHabits;
  habits: Habit[];
  isExpanded: boolean;
  consistencyData: WeeklyConsistencyData | undefined;
  onToggle: () => void;
}

export function ReviewHistoryRecord({
  review,
  habits,
  isExpanded,
  consistencyData,
  onToggle,
}: ReviewHistoryRecordProps) {
  const habitById = Object.fromEntries(habits.map((h) => [h.id, h]));
  const breakHabits = habits.filter((h) => h.category === "break");
  const buildHabits = habits.filter((h) => h.category === "build");

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between py-3"
      >
        <div className="flex flex-col items-start gap-0.5">
          <p className="font-sans text-sm text-soft">
            {format(parseISO(review.week_ending), "d MMM yyyy")}
          </p>
          {review.self_rated_consistency !== null && (
            <p className="font-sans text-xs text-muted">
              {review.self_rated_consistency}/5
            </p>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-muted" />
        ) : (
          <ChevronDown size={16} className="text-muted" />
        )}
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-5 pb-6">
          {review.engine_response && (
            <div className="flex flex-col gap-1">
              <p className="font-sans text-[11px] text-muted uppercase tracking-wider">
                Mirror
              </p>
              <p className="font-sans text-[13px] text-soft leading-relaxed">
                {review.engine_response}
              </p>
            </div>
          )}

          {review.pride_note && (
            <div className="flex flex-col gap-1">
              <p className="font-sans text-[11px] text-muted uppercase tracking-wider">
                Standing up
              </p>
              <p className="font-sans text-[13px] text-soft leading-relaxed">
                {review.pride_note}
              </p>
            </div>
          )}

          {review.habit_reviews.map((hr) => {
            const habit = habitById[hr.habit_id];
            if (!habit) return null;
            return (
              <div key={hr.id} className="flex flex-col gap-1">
                <p className="font-sans text-[11px] text-muted uppercase tracking-wider">
                  {habit.name}
                </p>
                {hr.what_done && (
                  <p className="font-sans text-[13px] text-soft leading-relaxed">
                    {hr.what_done}
                  </p>
                )}
              </div>
            );
          })}

          {review.self_rated_consistency !== null && (
            <div className="flex flex-col gap-1">
              <p className="font-sans text-[11px] text-muted uppercase tracking-wider">
                Consistency
              </p>
              <p className="font-sans text-[13px] text-soft">
                Self-rated {review.self_rated_consistency}/5
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
    </div>
  );
}
