"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type PomodoroMode = "focus" | "break";

interface UsePomodoroOptions {
  focusMinutes?: number;
  breakMinutes?: number;
  /** Called when a phase reaches zero, with the phase that just finished. */
  onPhaseComplete?: (mode: PomodoroMode, minutes: number) => void;
}

/**
 * Pomodoro state machine (focus ⇄ break). The countdown is computed
 * from an absolute end time, so it stays accurate if the tab is throttled.
 */
export function usePomodoro({ focusMinutes = 25, breakMinutes = 5, onPhaseComplete }: UsePomodoroOptions = {}) {
  const minutesFor = useCallback(
    (mode: PomodoroMode) => (mode === "focus" ? focusMinutes : breakMinutes),
    [focusMinutes, breakMinutes],
  );

  const [mode, setMode] = useState<PomodoroMode>("focus");
  const [remainingSeconds, setRemainingSeconds] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const endsAtRef = useRef(0);
  const onCompleteRef = useRef(onPhaseComplete);

  useEffect(() => {
    onCompleteRef.current = onPhaseComplete;
  }, [onPhaseComplete]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      const left = Math.max(0, Math.round((endsAtRef.current - Date.now()) / 1000));
      setRemainingSeconds(left);
      if (left > 0) return;

      window.clearInterval(intervalId);
      const next: PomodoroMode = mode === "focus" ? "break" : "focus";
      setIsRunning(false);
      setMode(next);
      setRemainingSeconds(minutesFor(next) * 60);
      onCompleteRef.current?.(mode, minutesFor(mode));
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [isRunning, mode, minutesFor]);

  const start = () => {
    endsAtRef.current = Date.now() + remainingSeconds * 1000;
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setRemainingSeconds(minutesFor(mode) * 60);
  };

  const switchMode = (nextMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(nextMode);
    setRemainingSeconds(minutesFor(nextMode) * 60);
  };

  const totalSeconds = minutesFor(mode) * 60;

  return {
    mode,
    remainingSeconds,
    isRunning,
    progress: ((totalSeconds - remainingSeconds) / totalSeconds) * 100,
    start,
    pause,
    reset,
    switchMode,
  };
}
