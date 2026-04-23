import { format } from "date-fns";

import { Button } from "@/components/ui/Button";
import { useUpsertEngineMark } from "@/hooks/useEngineMark";
import { useTimer } from "@/hooks/useTimer";

import { TimerButton } from "./TimerButton";

interface EngineSectionProps {
  userId: string;
  marked: boolean;
}

export function EngineSection({ userId, marked }: EngineSectionProps) {
  const { state, timeLeft, timerCompletedOnce, start } = useTimer();
  const { mutate: upsertMark, isPending } = useUpsertEngineMark(userId);

  const handleMark = () => {
    upsertMark({
      date: format(new Date(), "yyyy-MM-dd"),
      timer_completed: timerCompletedOnce,
      confirmed_at: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <TimerButton state={state} timeLeft={timeLeft} onStart={start} />
      {marked ? (
        <p className="font-serif italic text-[14px] text-violet text-center">
          Self-care engine tended.
        </p>
      ) : (
        <Button variant="ghost" onClick={handleMark} disabled={isPending}>
          I showed up today.
        </Button>
      )}
    </div>
  );
}
