import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

interface VariationValues {
  anchor: string;
  nonNegotiable: string;
  minimumVersion: string;
  fullVersion: string;
}

interface VariationConfigStepProps {
  habitName: string;
  initialValues?: Partial<VariationValues>;
  submitLabel?: string;
  onNext: (values: VariationValues) => void;
  onCancel?: () => void;
}

export function VariationConfigStep({
  habitName,
  initialValues = {},
  submitLabel = "Next",
  onNext,
  onCancel,
}: VariationConfigStepProps) {
  const [anchor, setAnchor] = useState(initialValues.anchor ?? "");
  const [nonNegotiable, setNonNegotiable] = useState(
    initialValues.nonNegotiable ?? "",
  );
  const [minimumVersion, setMinimumVersion] = useState(
    initialValues.minimumVersion ?? "",
  );
  const [fullVersion, setFullVersion] = useState(
    initialValues.fullVersion ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (
      !anchor.trim() ||
      !nonNegotiable.trim() ||
      !minimumVersion.trim() ||
      !fullVersion.trim()
    ) {
      setError("Fill in all fields to continue.");
      return;
    }
    onNext({
      anchor: anchor.trim(),
      nonNegotiable: nonNegotiable.trim(),
      minimumVersion: minimumVersion.trim(),
      fullVersion: fullVersion.trim(),
    });
  };

  return (
    <div className="flex flex-col px-8 py-12 gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif italic text-[32px] leading-tight text-plum">
          Set up {habitName}
        </h2>
        <p className="font-sans text-xs text-muted">
          Define what showing up looks like.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label>Anchor — when will you do this?</Label>
          <input
            type="text"
            value={anchor}
            onChange={(e) => {
              setAnchor(e.target.value);
              setError(null);
            }}
            placeholder="e.g. After morning coffee"
            className="w-full bg-card border border-[0.5px] border-border rounded-2xl px-4 py-3 font-sans text-[13px] text-plum outline-none placeholder:text-muted"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Non-negotiable — the bare minimum</Label>
          <input
            type="text"
            value={nonNegotiable}
            onChange={(e) => {
              setNonNegotiable(e.target.value);
              setError(null);
            }}
            placeholder="e.g. 5 sun salutations"
            className="w-full bg-card border border-[0.5px] border-border rounded-2xl px-4 py-3 font-sans text-[13px] text-plum outline-none placeholder:text-muted"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Minimum version</Label>
          <input
            type="text"
            value={minimumVersion}
            onChange={(e) => {
              setMinimumVersion(e.target.value);
              setError(null);
            }}
            placeholder="e.g. 20 minute flow"
            className="w-full bg-card border border-[0.5px] border-border rounded-2xl px-4 py-3 font-sans text-[13px] text-plum outline-none placeholder:text-muted"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Full session</Label>
          <input
            type="text"
            value={fullVersion}
            onChange={(e) => {
              setFullVersion(e.target.value);
              setError(null);
            }}
            placeholder="e.g. 60 minute practice"
            className="w-full bg-card border border-[0.5px] border-border rounded-2xl px-4 py-3 font-sans text-[13px] text-plum outline-none placeholder:text-muted"
          />
        </div>
      </div>

      {error && <p className="font-sans text-xs text-amber">{error}</p>}

      <Button variant="primary" onClick={handleNext}>
        {submitLabel}
      </Button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="font-sans text-[13px] text-muted text-center bg-transparent border-none cursor-pointer"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
