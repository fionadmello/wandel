import { Button } from "@/components/ui/Button";
import type { ExerciseConfig as ExerciseConfigType } from "@/types/setup";

interface ExerciseConfigProps {
  values: ExerciseConfigType[];
  onNext: (values: ExerciseConfigType[]) => void;
}

export function ExerciseConfig({ values, onNext }: ExerciseConfigProps) {
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
