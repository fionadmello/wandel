import { Link, useSearch } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { useBreakHabits } from "@/hooks/useBreakHabits";
import { useBuildHabits } from "@/hooks/useBuildHabits";
import { useSession } from "@/hooks/useSession";
import { useAllStandingUpEntries } from "@/hooks/useStandingUpLog";
import { useWeeklyConsistency } from "@/hooks/useWeeklyConsistency";
import { computeUnreviewedSundays } from "@/hooks/useWeeklyReview";
import { useWeeklyReviewHistory } from "@/hooks/useWeeklyReviewHistory";

import { ReviewHistoryRecord } from "./ReviewHistoryRecord";
import { ReviewStepper } from "./ReviewStepper";

function ReviewContent({ userId }: { userId: string }) {
  const { weekEnding: paramWeekEnding } = useSearch({ from: "/review" });
  const [expandedWeekEnding, setExpandedWeekEnding] = useState<string | null>(
    paramWeekEnding ?? null,
  );
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(
    null,
  );

  const breakHabitsQuery = useBreakHabits(userId);
  const buildHabitsQuery = useBuildHabits(userId);
  const historyQuery = useWeeklyReviewHistory(userId);
  const standingUpQuery = useAllStandingUpEntries(userId);

  const breakHabits = (breakHabitsQuery.data ?? []).filter(
    (h) => h.status === "active",
  );
  const buildHabits = (buildHabitsQuery.data ?? []).filter(
    (h) => h.status === "active",
  );
  const allHabits = [...breakHabits, ...buildHabits];
  const allReviews = historyQuery.data ?? [];
  const standingUpEntries = standingUpQuery.data ?? [];

  const reviewedWeekEndings = allReviews.map((r) => r.week_ending);
  const unreviewedSundays = computeUnreviewedSundays(reviewedWeekEndings, 3);

  const expandedHistoryReview =
    allReviews.find((r) => r.id === expandedHistoryId) ?? null;

  const historyConsistencyQuery = useWeeklyConsistency(
    userId,
    expandedHistoryReview?.week_ending ?? "",
  );

  return (
    <ScreenWrap>
      <div className="flex flex-col px-6 pt-6 pb-12 gap-8">
        <div className="flex items-center justify-between">
          <Link to="/morning" className="font-sans text-sm text-muted">
            ← Morning
          </Link>
          <p className="font-serif italic text-lg text-plum">Weekly review</p>
        </div>

        {unreviewedSundays.length > 0 && (
          <div className="flex flex-col">
            {unreviewedSundays.map((weekEnding) => (
              <div key={weekEnding} className="flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedWeekEnding(
                      expandedWeekEnding === weekEnding ? null : weekEnding,
                    )
                  }
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <p className="font-sans text-sm text-soft">
                      Week ending {format(parseISO(weekEnding), "d MMM yyyy")}
                    </p>
                    <p className="font-sans text-xs text-muted">
                      Not yet reviewed
                    </p>
                  </div>
                  <p className="font-sans text-sm text-plum">→</p>
                </button>

                {expandedWeekEnding === weekEnding && (
                  <ReviewStepper
                    userId={userId}
                    weekEnding={weekEnding}
                    breakHabits={breakHabits}
                    buildHabits={buildHabits}
                    standingUpEntries={standingUpEntries}
                    onComplete={() => setExpandedWeekEnding(null)}
                    onCancel={() => setExpandedWeekEnding(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {allReviews.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-sans text-xs text-muted uppercase tracking-wide">
              Past reviews
            </p>
            {allReviews.map((review) => (
              <ReviewHistoryRecord
                key={review.id}
                review={review}
                habits={allHabits}
                isExpanded={expandedHistoryId === review.id}
                consistencyData={
                  expandedHistoryId === review.id
                    ? historyConsistencyQuery.data
                    : undefined
                }
                onToggle={() =>
                  setExpandedHistoryId(
                    expandedHistoryId === review.id ? null : review.id,
                  )
                }
              />
            ))}
          </div>
        )}

        {historyQuery.isLoading && (
          <p className="font-sans text-xs text-muted">Loading…</p>
        )}
      </div>
    </ScreenWrap>
  );
}

export function ReviewScreen() {
  const { session, loading } = useSession();
  const userId = session?.user.id ?? "";

  if (loading || !userId) {
    return (
      <ScreenWrap>
        <div className="flex items-center justify-center min-h-dvh">
          <p className="font-sans text-xs text-muted">Loading…</p>
        </div>
      </ScreenWrap>
    );
  }

  return <ReviewContent userId={userId} />;
}
