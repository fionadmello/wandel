import { useState } from "react";

import type { Habit } from "@/types/database";
import type { WeeklyConsistencyData } from "@/types/review";

const RATINGS = [1, 2, 3, 4, 5] as const;

interface ConsistencyStepProps {
  breakHabits: Habit[];
  buildHabits: Habit[];
  consistencyData: WeeklyConsistencyData | undefined;
  value: number | null;
  onChange: (value: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ConsistencyStep({
  breakHabits,
  buildHabits,
  consistencyData,
  value,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
}: ConsistencyStepProps) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    if (value !== null) setRevealed(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-serif italic text-2xl text-plum leading-snug">
          Consistency
        </p>
        <p className="font-sans text-sm text-muted">
          How consistent were you this week? Rate yourself first.
        </p>
      </div>

      <div className="flex gap-3">
        {RATINGS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            className={[
              "w-10 h-10 rounded-full font-sans text-sm border",
              value === r
                ? "bg-plum text-canvas border-plum"
                : "bg-card text-muted border-border",
            ].join(" ")}
          >
            {r}
          </button>
        ))}
      </div>

      {!revealed && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="font-sans text-sm text-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReveal}
            disabled={value === null}
            className="font-sans text-sm text-plum disabled:opacity-40"
          >
            See how I actually did →
          </button>
        </div>
      )}

      {revealed && consistencyData && (
        <>
          <div className="flex flex-col gap-3">
            <p className="font-sans text-xs text-muted uppercase tracking-wide">
              Actual
            </p>
            <div className="flex flex-col gap-1">
              <p className="font-sans text-sm text-soft">
                Mirror — {consistencyData.engineMarked}/7 days
              </p>
              {buildHabits.map((h) => (
                <p key={h.id} className="font-sans text-sm text-soft">
                  {h.name} — {consistencyData.buildObsDaysByHabit[h.id] ?? 0}/7
                  days logged
                </p>
              ))}
              {breakHabits.map((h) => (
                <p key={h.id} className="font-sans text-sm text-soft">
                  {h.name} —{" "}
                  {7 - (consistencyData.breakObsDaysByHabit[h.id] ?? 0)}/7 clean
                  days
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="font-sans text-sm text-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="font-sans text-sm text-plum disabled:opacity-40"
            >
              {isSubmitting ? "Saving…" : "Complete review →"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
