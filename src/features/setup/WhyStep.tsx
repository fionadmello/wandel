import { useForm } from "@tanstack/react-form";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { TextInput } from "@/components/ui/TextInput";
import { DEFAULT_WHY_STATEMENT } from "@/constants/defaultWhyStatement";
import { whyStatementSchema } from "@/schemas/setup";
import type { SetupDraft } from "@/types/setup";

interface WhyStepProps {
  value: SetupDraft["whyStatement"];
  onNext: (value: SetupDraft["whyStatement"]) => void;
}

export function WhyStep({ value, onNext }: WhyStepProps) {
  const form = useForm({
    defaultValues: {
      whyStatement: value || DEFAULT_WHY_STATEMENT,
    },
    validators: { onChange: whyStatementSchema },
    onSubmit: ({ value: formValue }) => {
      onNext(formValue.whyStatement);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col justify-center min-h-dvh px-8 gap-8"
    >
      <div className="flex flex-col gap-2">
        <h2 className="font-serif italic text-[32px] leading-tight text-plum">
          What drives you?
        </h2>
        <p className="font-sans text-xs text-muted">
          Write it in your own words. You can always change it later.
        </p>
      </div>

      <form.Field name="whyStatement">
        {(field) => (
          <div>
            <Label htmlFor="why">Your why</Label>
            <TextInput
              id="why"
              multiline
              rows={4}
              value={field.state.value}
              onChange={field.handleChange}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 font-sans text-xs text-amber">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <Button type="submit" variant="primary">
        Next
      </Button>
    </form>
  );
}
