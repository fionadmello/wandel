import { createFileRoute, Link } from "@tanstack/react-router";

import { ScreenWrap } from "@/components/layout/ScreenWrap";

export const Route = createFileRoute("/review")({
  component: ReviewScreen,
});

function ReviewScreen() {
  return (
    <ScreenWrap>
      <div className="flex flex-col px-6 pt-6 gap-6">
        <Link to="/morning" className="font-sans text-sm text-muted">
          ← Back
        </Link>
        <p className="font-serif italic text-2xl text-plum">Weekly review</p>
        <p className="font-sans text-sm text-muted">Coming soon.</p>
      </div>
    </ScreenWrap>
  );
}
