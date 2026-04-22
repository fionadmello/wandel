import { Button } from "@/components/ui/Button";
import type { SetupDraft } from "@/types/setup";

interface WhyStepProps {
  value: SetupDraft["whyStatement"];
  onNext: (value: SetupDraft["whyStatement"]) => void;
}

export function WhyStep({ value, onNext }: WhyStepProps) {
  return (
    <div className="flex flex-col justify-center min-h-dvh px-8 gap-6">
      <p className="font-sans text-sm text-muted">
        Why statement — coming soon
      </p>
      <p className="font-sans text-xs text-muted">{value || "(empty)"}</p>
      <Button variant="primary" onClick={() => onNext(value)}>
        Next
      </Button>
    </div>
  );
}
