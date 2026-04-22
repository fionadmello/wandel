import { Button } from "@/components/ui/Button";
import { TAGLINE } from "@/constants/tagline";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-8 text-center gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif italic text-[54px] leading-none text-plum">
          wandel.
        </h1>
        <p className="font-sans text-sm text-muted">{TAGLINE}</p>
      </div>
      <Button variant="primary" onClick={onNext}>
        Begin
      </Button>
    </div>
  );
}
