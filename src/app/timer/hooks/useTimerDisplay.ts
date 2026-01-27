"use client";

import { useState, useEffect } from "react";
import { useTimerStore } from "@/store/timerStore";
import type { TimerResponse } from "./useGetTimers";

export function useTimerDisplay(timerData: TimerResponse | undefined) {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  const isTimerRunning = useTimerStore((state) => state.isTimerRunning);
  const isTimerPaused = useTimerStore((state) => state.isTimerPaused);
  const startTimeFromStore = useTimerStore((state) => state.startTime);
  const setIsTimerRunning = useTimerStore((state) => state.setIsTimerRunning);
  const setIsTimerPaused = useTimerStore((state) => state.setIsTimerPaused);
  const setStartTime = useTimerStore((state) => state.setStartTime);

  const effectiveStartTime = timerData?.startTime || startTimeFromStore;

  useEffect(() => {
    if (!isTimerRunning || isTimerPaused || !effectiveStartTime) return;

    const pad = (n: number) => String(n).padStart(2, "0");

    const tick = () => {
      const elapsedMs = Date.now() - new Date(effectiveStartTime).getTime();
      const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setHours(pad(h));
      setMinutes(pad(m));
      setSeconds(pad(s));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isTimerRunning, isTimerPaused, effectiveStartTime]);

  const onPauseClick = () => setIsTimerPaused(true);
  const onResumeClick = () => setIsTimerPaused(false);

  const onFinishClick = () => {
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setStartTime("");
  };

  const onResetClick = () => {
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setStartTime("");
    setHours("00");
    setMinutes("00");
    setSeconds("00");
  };

  return {
    hours,
    minutes,
    seconds,
    isTimerRunning,
    isTimerPaused,
    onPauseClick,
    onResumeClick,
    onFinishClick,
    onResetClick,
    isStartDisabled: isTimerRunning && !isTimerPaused,
    isPauseDisabled: !isTimerRunning || isTimerPaused,
    isFinishDisabled: !isTimerRunning,
  };
}
