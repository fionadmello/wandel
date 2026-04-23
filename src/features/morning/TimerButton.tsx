import type { TimerState } from "@/hooks/useTimer";

interface TimerButtonProps {
  state: TimerState;
  timeLeft: number;
  onStart: () => void;
}

export function TimerButton({ state, timeLeft, onStart }: TimerButtonProps) {
  const isActive = state === "pulse" || state === "done";
  const bg = isActive ? "bg-amber" : "bg-plum";
  const label =
    state === "done" ? "done" : state === "pulse" ? "✓" : String(timeLeft);
  const fontSize =
    state === "done"
      ? "text-[18px]"
      : state === "pulse"
        ? "text-[28px]"
        : "text-[38px]";

  return (
    <button
      type="button"
      onClick={state === "idle" ? onStart : undefined}
      className={`w-[88px] h-[88px] rounded-full flex items-center justify-center border-none transition-colors duration-300 shadow-btn-primary ${bg} ${state === "idle" ? "cursor-pointer" : "cursor-default"}`}
      aria-label="Start 20-second mirror practice"
    >
      <span
        className={`font-serif text-canvas leading-none transition-all duration-200 ${fontSize}`}
      >
        {label}
      </span>
    </button>
  );
}
