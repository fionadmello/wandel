import { useState } from "react";

import { ScreenWrap } from "@/components/layout/ScreenWrap";
import { Divider } from "@/components/ui/Divider";

import { EmailPasswordForm } from "./EmailPasswordForm";
import { ConfirmationScreen } from "./MagicLinkConfirmation";
import { MagicLinkForm } from "./MagicLinkForm";

type PendingConfirmation =
  | { type: "signup"; email: string }
  | { type: "magic-link"; email: string }
  | null;

export function AuthScreen() {
  const [pending, setPending] = useState<PendingConfirmation>(null);

  if (pending?.type === "signup") {
    return (
      <ConfirmationScreen
        email={pending.email}
        message="We sent a confirmation link to"
      />
    );
  }

  if (pending?.type === "magic-link") {
    return (
      <ConfirmationScreen
        email={pending.email}
        message="We sent a magic link to"
      />
    );
  }

  return (
    <ScreenWrap padBottom={false}>
      <div className="flex flex-col justify-center min-h-dvh px-8 py-12 gap-8">
        <h1 className="font-serif italic text-[54px] leading-none text-plum text-center">
          wandel.
        </h1>

        <div className="flex flex-col gap-6">
          <EmailPasswordForm
            onConfirmationRequired={(email) =>
              setPending({ type: "signup", email })
            }
          />

          <div className="flex items-center gap-3">
            <Divider className="flex-1 my-0" />
            <span className="font-sans text-xs text-muted shrink-0">or</span>
            <Divider className="flex-1 my-0" />
          </div>

          <MagicLinkForm
            onSent={(email) => setPending({ type: "magic-link", email })}
          />
        </div>
      </div>
    </ScreenWrap>
  );
}
