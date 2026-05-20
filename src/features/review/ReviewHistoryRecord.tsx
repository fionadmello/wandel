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
    <div className="flex flex-col border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between py-4 w-full"
      >
        <div className="flex flex-col items-start gap-1">
          <p className="font-serif italic text-[17px] text-plum">
            {format(parseISO(review.week_ending), "d MMM yyyy")}
          </p>
          {review.engine_response ? (
            <p className="font-sans text-[12px] text-muted line-clamp-1">
              {review.engine_response}
            </p>
          ) : review.self_rated_consistency !== null ? (
            <p className="font-sans text-[12px] text-muted">
              Consistency {review.self_rated_consistency}/5
            </p>
          ) : null}
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-muted shrink-0 ml-4" />
        ) : (
          <ChevronDown size={16} className="text-muted shrink-0 ml-4" />
        )}
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-7 pb-8">
          {review.engine_response && (
            <div className="flex flex-col gap-1">
              <p className="font-sans text-[11px] text-violet tracking-wider">
                Mirror
              </p>
              <p className="font-serif text-[17px] text-plum leading-relaxed">
                {review.engine_response}
              </p>
            </div>
          )}

          {review.pride_note && (
            <div className="flex flex-col gap-1">
              <p className="font-sans text-[11px] text-violet tracking-wider">
                Standing up
              </p>
              <p className="font-serif text-[17px] text-plum leading-relaxed">
                {review.pride_note}
              </p>
            </div>
          )}

          {review.habit_reviews.map((hr) => {
            const habit = habitById[hr.habit_id];
            if (!habit) return null;
            return (
              <div key={hr.id} className="flex flex-col gap-1">
                <p className="font-sans text-[11px] text-violet tracking-wider">
                  {habit.name}
                </p>
                {hr.what_done && (
                  <p className="font-serif text-[17px] text-plum leading-relaxed">
                    {hr.what_done}
                  </p>
                )}
              </div>
            );
          })}

          {review.self_rated_consistency !== null && (
            <div className="flex flex-col gap-1">
              <p className="font-sans text-[11px] text-violet tracking-wider">
                Consistency
              </p>
              <p className="font-sans text-sm text-plum">
                Self-rated {review.self_rated_consistency}/5
              </p>
              {consistencyData && (
                <div className="flex flex-col gap-1 mt-1">
                  <p className="font-sans text-xs text-soft">
                    Mirror — {consistencyData.engineMarked}/7 days
                  </p>
                  {buildHabits.map((h) => (
                    <p key={h.id} className="font-sans text-xs text-soft">
                      {h.name} —{" "}
                      {consistencyData.buildObsDaysByHabit[h.id] ?? 0}/7 days
                    </p>
                  ))}
                  {breakHabits.map((h) => (
                    <p key={h.id} className="font-sans text-xs text-soft">
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
