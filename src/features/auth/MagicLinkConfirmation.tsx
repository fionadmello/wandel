import { TAGLINE } from "@/constants/tagline";

interface ConfirmationScreenProps {
  email: string;
  message: string;
}

export function ConfirmationScreen({
  email,
  message,
}: ConfirmationScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-8 text-center gap-4">
      <h1 className="font-serif italic text-[54px] leading-none text-plum">
        wandel.
      </h1>
      <p className="font-sans text-sm text-muted">{TAGLINE}</p>
      <p className="font-sans text-sm text-plum">Check your inbox</p>
      <p className="font-sans text-xs text-muted">
        {message} <span className="text-violet font-medium">{email}</span>.
      </p>
    </div>
  );
}
