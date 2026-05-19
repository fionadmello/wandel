interface EngineStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function EngineStep({
  value,
  onChange,
  onNext,
  onCancel,
}: EngineStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="font-serif italic text-2xl text-plum leading-snug">
          The mirror
        </p>
        <p className="font-sans text-sm text-muted">
          How did the mirror practice feel this week?
        </p>
      </div>

      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write freely…"
        className="w-full font-sans text-sm bg-card border border-border rounded-lg p-3 resize-none focus:outline-none"
      />

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
