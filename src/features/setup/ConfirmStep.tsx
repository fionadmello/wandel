import { useRouter } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Label } from "@/components/ui/Label";
import { ReminderCard } from "@/components/ui/ReminderCard";
import { useCompleteSetup } from "@/hooks/useCompleteSetup";
import type { SetupDraft } from "@/types/setup";

interface ConfirmStepProps {
  draft: SetupDraft;
}

export function ConfirmStep({ draft }: ConfirmStepProps) {
  const router = useRouter();
  const { mutate, isPending, error } = useCompleteSetup();

  const handleSubmit = () => {
    mutate(draft, {
      onSuccess: async () => {
        await router.invalidate();
      },
    });
  };

  return (
    <div className="flex flex-col min-h-dvh px-8 py-12 gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="font-serif italic text-[32px] leading-tight text-plum">
          You're ready.
        </h2>
        <p className="font-sans text-xs text-muted">
          Here's what you've set up. You can always change this in settings.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label>Your why</Label>
          <p className="font-serif italic text-[18px] text-violet leading-snug">
            "{draft.whyStatement}"
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Qualities</Label>
          <div className="flex flex-wrap gap-2">
            {draft.qualities.map((q) => (
              <Chip key={q} label={q} selected />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Kindness reminders</Label>
          <div className="flex flex-col gap-3">
            {draft.reminders.map((r, i) => (
              <ReminderCard key={i} text={r} />
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="font-sans text-xs text-amber">
          Something went wrong. Please try again.
        </p>
      )}

      <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Setting up..." : "Start Wandel"}
      </Button>
    </div>
  );
}
