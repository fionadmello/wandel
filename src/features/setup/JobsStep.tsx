import { Button } from "@/components/ui/Button";
import type { SetupDraft } from "@/types/setup";

interface JobsStepProps {
  values: SetupDraft["jobs"];
  onNext: (values: SetupDraft["jobs"]) => void;
}

export function JobsStep({ values, onNext }: JobsStepProps) {
  return (
    <div className="flex flex-col justify-center min-h-dvh px-8 gap-6">
      <p className="font-sans text-sm text-muted">Jobs — coming soon</p>
      <Button variant="primary" onClick={() => onNext(values)}>
        Next
      </Button>
    </div>
  );
}
