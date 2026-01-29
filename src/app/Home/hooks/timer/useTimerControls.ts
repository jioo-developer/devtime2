"use client";

import { useRef } from "react";
import { useTimerStore } from "@/store/timerStore";
import { useShallow } from "zustand/react/shallow";

export function useTimerControls() {
  const pausedStartedAtRef = useRef<number | null>(null);

  const {
    setIsTimerRunning,
    setIsTimerPaused,
    setStartTime,
    setClientStartedAt,
    setTotalPausedDuration,
  } = useTimerStore(
    useShallow((state) => ({
      setIsTimerRunning: state.setIsTimerRunning,
      setIsTimerPaused: state.setIsTimerPaused,
      setStartTime: state.setStartTime,
      setClientStartedAt: state.setClientStartedAt,
      setTotalPausedDuration: state.setTotalPausedDuration,
    }))
  );

  const onPause = () => {
    pausedStartedAtRef.current = Date.now();
    setIsTimerPaused(true);
  };

  const onResume = () => {
    const pausedStartedAt = pausedStartedAtRef.current;
    if (pausedStartedAt != null) {
      const pausedElapsedMs = Date.now() - pausedStartedAt;
      setTotalPausedDuration((prev: number) => prev + pausedElapsedMs);
      pausedStartedAtRef.current = null;
    }
    setIsTimerPaused(false);
  };

  const onFinish = () => {
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setStartTime("");
  };

  const onReset = () => {
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setStartTime("");
    setClientStartedAt(null);
    setTotalPausedDuration(0);
    pausedStartedAtRef.current = null;
  };

  return { onPause, onResume, onFinish, onReset };
}
