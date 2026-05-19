import type { StandingUpEntry } from "@/types/database";

interface StandingUpStepProps {
  entries: StandingUpEntry[];
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function StandingUpStep({
  entries,
  value,
  onChange,
  onNext,
  onCancel,
}: StandingUpStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-serif italic text-2xl text-plum leading-snug">
          Standing up
        </p>
        <p className="font-sans text-sm text-muted">
          You stood back up this week.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col">
            <p className="font-sans text-sm text-soft">{entry.track_name}</p>
            <p className="font-sans text-xs text-muted">
              {entry.gap_days === 0
                ? "Same day"
                : `${entry.gap_days} day${entry.gap_days === 1 ? "" : "s"} gap`}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-sans text-sm text-muted">
          How do you feel about this?
        </p>
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write freely…"
          className="w-full font-sans text-sm bg-card border border-border rounded-lg p-3 resize-none focus:outline-none"
        />
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
          onClick={onNext}
          className="font-sans text-sm text-plum"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
