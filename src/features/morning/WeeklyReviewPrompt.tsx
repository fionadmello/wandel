import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { Check } from "lucide-react";

import type { WeeklyReview } from "@/types/database";

interface WeeklyReviewPromptProps {
  review: WeeklyReview | null;
  weekEnding: string;
}

export function WeeklyReviewPrompt({
  review,
  weekEnding,
}: WeeklyReviewPromptProps) {
  if (review) {
    return (
      <div className="flex items-center gap-2">
        <p className="font-sans text-sm text-muted">
          Weekly review · {format(parseISO(review.week_ending), "d MMM")}
        </p>
        <Check size={14} className="text-teal" />
      </div>
    );
  }

  return (
    <Link to="/review" search={{ weekEnding }}>
      <p className="font-serif italic text-[17px] text-plum leading-snug">
        Weekly review
      </p>
      <p className="font-sans text-sm text-muted mt-1">
        Take a few minutes to reflect on the week.
      </p>
    </Link>
  );
}
