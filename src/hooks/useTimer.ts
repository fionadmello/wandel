import { useCallback, useEffect, useRef, useState } from "react";

export type TimerState = "idle" | "running" | "pulse" | "done";

const DURATION = 20;
const PULSE_MS = 1500;
const DONE_MS = 2000;

export function useTimer() {
  const [state, setState] = useState<TimerState>("idle");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [timerCompletedOnce, setTimerCompletedOnce] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRefs = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => () => clearRefs(), []);

  const start = useCallback(() => {
    if (state !== "idle") return;

    setState("running");
    setTimeLeft(DURATION);

    let remaining = DURATION;

    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        setState("pulse");
        setTimerCompletedOnce(true);

        timeoutRef.current = setTimeout(() => {
          setState("done");

          timeoutRef.current = setTimeout(() => {
            setState("idle");
            setTimeLeft(DURATION);
          }, DONE_MS);
        }, PULSE_MS);
      }
    }, 1000);
  }, [state]);

  return { state, timeLeft, timerCompletedOnce, start };
}
