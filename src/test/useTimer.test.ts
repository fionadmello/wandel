import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useTimer } from "@/hooks/useTimer";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useTimer", () => {
  it("starts in idle state with full time", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.state).toBe("idle");
    expect(result.current.timeLeft).toBe(20);
    expect(result.current.timerCompletedOnce).toBe(false);
  });

  it("transitions to running when start is called", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    expect(result.current.state).toBe("running");
  });

  it("ignores start calls when already running", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(5000));
    const timeMid = result.current.timeLeft;
    act(() => result.current.start());
    expect(result.current.timeLeft).toBe(timeMid);
  });

  it("counts down one second per tick", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.timeLeft).toBe(17);
  });

  it("transitions to pulse when countdown reaches zero", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(20000));
    expect(result.current.state).toBe("pulse");
    expect(result.current.timeLeft).toBe(0);
  });

  it("sets timerCompletedOnce to true after first completion", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(20000));
    expect(result.current.timerCompletedOnce).toBe(true);
  });

  it("transitions from pulse to done after 1500ms", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(21500));
    expect(result.current.state).toBe("done");
  });

  it("resets to idle after done state", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(23500));
    expect(result.current.state).toBe("idle");
    expect(result.current.timeLeft).toBe(20);
  });

  it("timerCompletedOnce stays true after reset", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(23500));
    expect(result.current.timerCompletedOnce).toBe(true);
  });

  it("can be run again after reset", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(23500));
    act(() => result.current.start());
    expect(result.current.state).toBe("running");
  });
});
