import { Button } from "@/components/ui/Button";

interface ScheduledStateProps {
  onStart: () => void;
  isPending: boolean;
}

export function ScheduledState({ onStart, isPending }: ScheduledStateProps) {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="bg-card rounded-2xl border-l-[3px] border-violet px-4 py-4">
        <p className="font-serif italic text-[15px] text-plum leading-snug">
          This habit is scheduled but not yet active.
        </p>
      </div>
      <Button variant="accent" onClick={onStart} disabled={isPending}>
        Start tracking
      </Button>
    </div>
  );
}
