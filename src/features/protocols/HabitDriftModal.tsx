import { format, subDays } from "date-fns";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ProtocolModal } from "@/features/protocols/ProtocolModal";
import { useBreakHabit } from "@/hooks/useBreakHabits";
import { useBuildHabit } from "@/hooks/useBuildHabits";
import { useLogSlipDrift } from "@/hooks/useSlipDriftLog";
import { useLogStandingUp } from "@/hooks/useStandingUpLog";
import type { PendingProtocol } from "@/types/protocols";

type Phase = 1 | 2 | 3 | 4;
type CauseCategory = "distress_tolerance" | "logistics" | "emotional_load";

interface HabitDriftModalProps {
  protocol: PendingProtocol;
  userId: string;
  onDismiss: () => void;
  onComplete: () => void;
}

export function HabitDriftModal({
  protocol,
  userId,
  onDismiss,
  onComplete,
}: HabitDriftModalProps) {
  const isBreak = protocol.trackType === "break";
  const driftDays = protocol.driftDays ?? 2;

  const [phase, setPhase] = useState<Phase>(1);
  const [selectedCause, setSelectedCause] = useState<CauseCategory | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  const { data: breakHabit } = useBreakHabit(
    userId,
    isBreak ? (protocol.habitId ?? "") : "",
  );
  const { data: buildHabit } = useBuildHabit(
    userId,
    !isBreak ? (protocol.habitId ?? "") : "",
  );

  const jobConfigs = (breakHabit?.configs ?? []).filter((c) => c.key === "job");
  const buildConfigs = buildHabit?.configs ?? [];
  const anchorConfig =
    buildConfigs.find((c) => c.key === "anchor" && c.sub_type === null) ??
    buildConfigs.find((c) => c.key === "anchor");
  const nonNegConfig =
    buildConfigs.find(
      (c) => c.key === "non_negotiable" && c.sub_type === null,
    ) ?? buildConfigs.find((c) => c.key === "non_negotiable");

  const { mutateAsync: logSlipDrift } = useLogSlipDrift(userId);
  const { mutateAsync: logStandingUp } = useLogStandingUp(userId);

  const causeAdjustment =
    selectedCause === "distress_tolerance"
      ? "Start with the smallest possible version. Just that."
      : selectedCause === "logistics"
        ? "Remove one friction point before the next attempt."
        : selectedCause === "emotional_load"
          ? "One thing, not everything. The minimum counts."
          : null;

  const selectCause = (cause: CauseCategory) => {
    setSelectedCause((prev) => (prev === cause ? null : cause));
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const today = format(new Date(), "yyyy-MM-dd");

    try {
      if (isBreak) {
        await Promise.all([
          logSlipDrift({
            track_type: "break",
            type: "drift",
            habit_id: protocol.habitId,
            cause_category: selectedCause,
            protocol_completed: true,
          }),
          logStandingUp({
            track_type: "break",
            track_name: protocol.trackName,
            protocol: "drift",
            habit_id: protocol.habitId,
            gap_days: driftDays,
            fall_date: format(subDays(new Date(), driftDays), "yyyy-MM-dd"),
            return_date: today,
          }),
        ]);
      } else {
        await logSlipDrift({
          track_type: "build",
          type: "drift",
          habit_id: protocol.habitId,
          cause_category: selectedCause,
          protocol_completed: true,
        });
      }
      onComplete();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtocolModal>
      {phase === 1 && (
        <div className="flex flex-col gap-6 px-6 pt-6 pb-12">
          <p className="font-serif text-[22px] leading-snug text-plum">
            You drifted for {driftDays} {driftDays === 1 ? "day" : "days"}. That
            happened.
          </p>

          <Button variant="primary" onClick={() => setPhase(2)}>
            Continue
          </Button>

          <button
            type="button"
            onClick={onDismiss}
            className="font-sans text-[13px] text-muted text-center bg-transparent border-none cursor-pointer"
          >
            Skip for now
          </button>
        </div>
      )}

      {phase === 2 && (
        <div className="flex flex-col gap-6 px-6 pt-6 pb-12">
          <p className="font-sans text-[12px] text-muted">What gave way?</p>

          <div className="flex flex-wrap gap-2">
            <Chip
              label="Distress tolerance"
              selected={selectedCause === "distress_tolerance"}
              onToggle={() => selectCause("distress_tolerance")}
            />
            <Chip
              label="Logistics"
              selected={selectedCause === "logistics"}
              onToggle={() => selectCause("logistics")}
            />
            <Chip
              label="Emotional load"
              selected={selectedCause === "emotional_load"}
              onToggle={() => selectCause("emotional_load")}
            />
          </div>

          {causeAdjustment && (
            <p className="font-serif italic text-[18px] text-plum leading-snug">
              {causeAdjustment}
            </p>
          )}

          <Button variant="primary" onClick={() => setPhase(3)}>
            Continue
          </Button>
        </div>
      )}

      {phase === 3 && (
        <div className="flex flex-col gap-6 px-6 pt-6 pb-12">
          <p className="font-sans text-[12px] text-muted leading-relaxed">
            This is what you wrote when you were thinking clearly. That person
            is still here.
          </p>

          {isBreak && jobConfigs.length > 0 && (
            <div className="flex flex-col gap-2">
              {jobConfigs.map((job) => (
                <div key={job.id} className="bg-card rounded-2xl px-4 py-3">
                  <p className="font-sans text-[13px] font-medium text-plum">
                    {job.value}
                  </p>
                  {job.sub_type && (
                    <p className="font-sans text-[11px] text-muted">
                      {job.sub_type}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isBreak && (
            <div className="flex flex-col gap-3">
              {anchorConfig && (
                <p className="font-serif italic text-[20px] text-plum leading-snug">
                  {anchorConfig.value}
                </p>
              )}
              {nonNegConfig && (
                <div className="bg-card rounded-2xl px-4 py-3">
                  <p className="font-sans text-[11px] text-muted uppercase tracking-wider mb-1">
                    Non-negotiable
                  </p>
                  <p className="font-sans text-[13px] text-plum">
                    {nonNegConfig.value}
                  </p>
                </div>
              )}
            </div>
          )}

          <Button variant="primary" onClick={() => setPhase(4)}>
            Continue
          </Button>
        </div>
      )}

      {phase === 4 && (
        <div className="flex flex-col gap-6 px-6 pt-6 pb-12">
          {isBreak ? (
            <p className="font-serif text-[20px] leading-snug text-plum">
              Return to awareness. That is enough for today.
            </p>
          ) : (
            <>
              {nonNegConfig && (
                <div className="bg-card rounded-2xl px-4 py-3">
                  <p className="font-sans text-[11px] text-muted uppercase tracking-wider mb-1">
                    Today, just this
                  </p>
                  <p className="font-sans text-[13px] text-plum">
                    {nonNegConfig.value}
                  </p>
                </div>
              )}
              <p className="font-sans text-[13px] text-muted leading-relaxed">
                Return at the minimum, not with a grand recommitment.
              </p>
            </>
          )}

          <Button
            variant="accent"
            onClick={() => {
              void handleComplete();
            }}
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "I am returning."}
          </Button>
        </div>
      )}
    </ProtocolModal>
  );
}
