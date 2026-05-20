import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { useBreakHabits } from "@/hooks/useBreakHabits";
import { useBuildHabits } from "@/hooks/useBuildHabits";
import { useSession } from "@/hooks/useSession";

import { ReviewFlow } from "./ReviewFlow";
import { ReviewSummary } from "./ReviewSummary";

function ReviewContent({ userId }: { userId: string }) {
  const [isFlowing, setIsFlowing] = useState(false);

  const breakHabitsQuery = useBreakHabits(userId);
  const buildHabitsQuery = useBuildHabits(userId);

  const breakHabits = (breakHabitsQuery.data ?? []).filter(
    (h) => h.status === "active",
  );
  const buildHabits = (buildHabitsQuery.data ?? []).filter(
    (h) => h.status === "active",
  );

  return (
    <ScreenWrap>
      <div className="flex flex-col px-6 pt-6 pb-12 gap-6">
        {!isFlowing && (
          <div className="flex items-center justify-between">
            <Link to="/morning" className="font-sans text-sm text-muted">
              ← Morning
            </Link>
            <p className="font-serif italic text-lg text-plum">Weekly review</p>
          </div>
        )}

        {isFlowing ? (
          <ReviewFlow
            userId={userId}
            breakHabits={breakHabits}
            buildHabits={buildHabits}
            onComplete={() => setIsFlowing(false)}
            onCancel={() => setIsFlowing(false)}
          />
        ) : (
          <ReviewSummary
            userId={userId}
            breakHabits={breakHabits}
            buildHabits={buildHabits}
            onStartReview={() => setIsFlowing(true)}
          />
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
