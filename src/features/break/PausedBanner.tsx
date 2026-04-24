import { differenceInDays, parseISO } from "date-fns";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";

const PAUSE_LIMIT_DAYS = 14;

interface PausedBannerProps {
  pausedAt: string;
  onResume: () => void;
  onReset: () => void;
  onDeactivate: () => void;
  isPending: boolean;
}

export function PausedBanner({
  pausedAt,
  onResume,
  onReset,
  onDeactivate,
  isPending,
}: PausedBannerProps) {
  const daysPaused = differenceInDays(new Date(), parseISO(pausedAt));
  const overLimit = daysPaused >= PAUSE_LIMIT_DAYS;

  return (
    <div className="flex flex-col px-6 gap-6 pt-4">
      <div className="bg-card rounded-2xl border-l-[3px] border-amber px-4 py-4 flex flex-col gap-2">
        <p className="font-serif italic text-[15px] text-plum leading-snug">
          {overLimit
            ? `Paused for ${daysPaused} days. Reset or deactivate to continue.`
            : "This habit is paused."}
        </p>
        <p className="font-sans text-[12px] text-muted">
          Your past observations are still visible in the History tab.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {!overLimit && (
          <Button variant="accent" onClick={onResume} disabled={isPending}>
            Resume
          </Button>
        )}
        <Button variant="ghost" onClick={onReset} disabled={isPending}>
          Reset habit
        </Button>
        <Divider className="my-0" />
        <Button variant="ghost" onClick={onDeactivate} disabled={isPending}>
          Deactivate
        </Button>
      </div>
    </div>
  );
}
