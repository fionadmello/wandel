import { useState } from "react";

import { Button } from "@/components/ui/Button";

interface DeactivatedStateProps {
  onReset: () => void;
  isPending: boolean;
}

export function DeactivatedState({
  onReset,
  isPending,
}: DeactivatedStateProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col gap-5 pt-4">
      <p className="font-serif italic text-[18px] text-muted leading-snug">
        This habit has been deactivated.
      </p>
      <p className="font-sans text-[12px] text-muted">
        Your past observations are still visible in the History tab.
      </p>

      {confirming ? (
        <div className="flex flex-col gap-2">
          <p className="font-sans text-[13px] text-plum">Reset this habit?</p>
          <p className="font-sans text-[11px] text-muted">
            All observations will be permanently deleted.
          </p>
          <div className="flex gap-4 pt-1">
            <button
              type="button"
              onClick={onReset}
              disabled={isPending}
              className="font-sans text-[13px] font-medium text-amber bg-transparent border-none cursor-pointer"
            >
              {isPending ? "…" : "Yes, reset"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="font-sans text-[13px] text-muted bg-transparent border-none cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <Button variant="ghost" onClick={() => setConfirming(true)}>
          Reset habit
        </Button>
      )}
    </div>
  );
}
