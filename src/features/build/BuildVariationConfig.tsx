import { Button } from "@/components/ui/Button";
import type { VariationConfig } from "@/types/setup";

interface BuildVariationConfigProps {
  values: VariationConfig[];
  onNext: (values: VariationConfig[]) => void;
}

export function BuildVariationConfig({
  values,
  onNext,
}: BuildVariationConfigProps) {
  return (
    <div className="flex flex-col justify-center min-h-dvh px-8 gap-6">
      <p className="font-sans text-sm text-muted">
        Variation config — coming soon
      </p>
      <Button variant="primary" onClick={() => onNext(values)}>
        Next
      </Button>
    </div>
  );
}
