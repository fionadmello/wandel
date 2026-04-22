import { Button } from "@/components/ui/Button";
import type { SetupDraft } from "@/types/setup";

interface ExerciseStepProps {
  values: SetupDraft["exerciseTypes"];
  onNext: (values: SetupDraft["exerciseTypes"]) => void;
}

export function ExerciseStep({ values, onNext }: ExerciseStepProps) {
  return (
    <div className="flex flex-col justify-center min-h-dvh px-8 gap-6">
      <p className="font-sans text-sm text-muted">
        Exercise config — coming soon
      </p>
      <Button variant="primary" onClick={() => onNext(values)}>
        Next
      </Button>
    </div>
  );
}
