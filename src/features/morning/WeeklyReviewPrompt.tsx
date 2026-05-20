import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";

import { ConsistencyDots } from "@/components/ui/ConsistencyDots";
import type { WeeklyReview } from "@/types/database";

interface WeeklyReviewPromptProps {
  mostRecentReview: WeeklyReview | null;
  isSundayToday: boolean;
  isCurrentWeekReviewed: boolean;
  mostRecentSundayStr: string;
}

export function WeeklyReviewPrompt({
  mostRecentReview,
  isSundayToday,
  isCurrentWeekReviewed,
  mostRecentSundayStr,
}: WeeklyReviewPromptProps) {
  if (isSundayToday && !isCurrentWeekReviewed) {
    return (
      <div className="bg-card rounded-2xl px-5 py-4 flex flex-col gap-3">
        <p className="font-sans text-[11px] text-amber uppercase tracking-wider">
          Weekly review
        </p>
        <p className="font-serif text-[18px] text-plum leading-snug">
          This week deserves a moment of reflection.
        </p>
        <Link
          to="/review"
          search={{ weekEnding: mostRecentSundayStr }}
          className="font-sans text-[13px] text-amber"
        >
          Start review →
        </Link>
      </div>
    );
  }

  if (mostRecentReview) {
    return (
      <div className="bg-card rounded-2xl px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[11px] text-violet uppercase tracking-wider">
            Weekly review
          </p>
          <Link to="/review" className="font-sans text-[13px] text-violet">
            View all →
          </Link>
        </div>
        <p className="font-serif italic text-[16px] text-plum">
          {format(parseISO(mostRecentReview.week_ending), "d MMM yyyy")}
        </p>
        {mostRecentReview.self_rated_consistency !== null && (
          <ConsistencyDots rating={mostRecentReview.self_rated_consistency} />
        )}
        {mostRecentReview.engine_response && (
          <p className="font-sans text-[12px] text-muted line-clamp-2">
            {mostRecentReview.engine_response}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-sans text-[11px] text-muted uppercase tracking-wider">
          Weekly review
        </p>
        <Link to="/review" className="font-sans text-[13px] text-violet">
          View →
        </Link>
      </div>
      <p className="font-sans text-[13px] text-muted">
        Your weekly reflections will appear here.
      </p>
    </div>
  );
}
