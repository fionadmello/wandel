import { useForm } from "@tanstack/react-form";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { TextInput } from "@/components/ui/TextInput";
import { supabase } from "@/lib/supabase";
import { magicLinkSchema } from "@/schemas/auth";

interface MagicLinkFormProps {
  onSent: (email: string) => void;
}

export function MagicLinkForm({ onSent }: MagicLinkFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onChange: magicLinkSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await supabase.auth.signInWithOtp({
        email: value.email,
        options: { shouldCreateUser: true },
      });
      if (error) {
        setServerError(error.message);
      } else {
        onSent(value.email);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <form.Field name="email">
        {(field) => (
          <div>
            <Label htmlFor="magic-email">Email</Label>
            <TextInput
              id="magic-email"
              type="email"
              value={field.state.value}
              onChange={field.handleChange}
              placeholder="you@example.com"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 font-sans text-xs text-amber">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {serverError && (
        <p className="font-sans text-xs text-amber">{serverError}</p>
      )}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" variant="ghost" disabled={isSubmitting}>
            Send magic link
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
