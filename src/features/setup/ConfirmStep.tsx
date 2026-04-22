import { Button } from "@/components/ui/Button";
import type { SetupDraft } from "@/types/setup";

interface ConfirmStepProps {
  draft: SetupDraft;
  onSubmit: () => void;
}

export function ConfirmStep({ draft, onSubmit }: ConfirmStepProps) {
  return (
    <div className="flex flex-col justify-center min-h-dvh px-8 gap-6">
      <p className="font-sans text-sm text-muted">Confirmation — coming soon</p>
      <pre className="font-sans text-xs text-muted break-all whitespace-pre-wrap">
        {JSON.stringify(draft, null, 2)}
      </pre>
      <Button variant="primary" onClick={onSubmit}>
        Start Wandel
      </Button>
    </div>
  );
}
