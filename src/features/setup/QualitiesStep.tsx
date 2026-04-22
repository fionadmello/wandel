import { Button } from "@/components/ui/Button";
import type { SetupDraft } from "@/types/setup";

interface QualitiesStepProps {
  values: SetupDraft["qualities"];
  onNext: (values: SetupDraft["qualities"]) => void;
}

export function QualitiesStep({ values, onNext }: QualitiesStepProps) {
  return (
    <div className="flex flex-col justify-center min-h-dvh px-8 gap-6">
      <p className="font-sans text-sm text-muted">Qualities — coming soon</p>
      <Button variant="primary" onClick={() => onNext(values)}>
        Next
      </Button>
    </div>
  );
}
