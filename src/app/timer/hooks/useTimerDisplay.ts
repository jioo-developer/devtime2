"use client";

import { useState, useEffect, useRef } from "react";
import { useTimerStore } from "@/store/timerStore";
import type { TimerResponse } from "./useGetTimers";

export function useTimerDisplay(timerData: TimerResponse | undefined) {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const pausedAtRef = useRef<number | null>(null);
  /** 방금 로컬에서 시작했을 때만 사용. effect가 처음 돌았을 때를 0초로 두기 위함 */
  const localDisplayEpochRef = useRef<number | null>(null);

  const isTimerRunning = useTimerStore((state) => state.isTimerRunning);
  const isTimerPaused = useTimerStore((state) => state.isTimerPaused);
  const startTimeFromStore = useTimerStore((state) => state.startTime);
  const clientStartedAt = useTimerStore((state) => state.clientStartedAt);
  const totalPausedDuration = useTimerStore((state) => state.totalPausedDuration);
  const setIsTimerRunning = useTimerStore((state) => state.setIsTimerRunning);
  const setIsTimerPaused = useTimerStore((state) => state.setIsTimerPaused);
  const setStartTime = useTimerStore((state) => state.setStartTime);
  const setClientStartedAt = useTimerStore((state) => state.setClientStartedAt);
  const setTotalPausedDuration = useTimerStore((state) => state.setTotalPausedDuration);

  const effectiveStartTime = timerData?.startTime || startTimeFromStore;
  const isLocalStart = clientStartedAt != null;
  const serverBaseMs = effectiveStartTime ? new Date(effectiveStartTime).getTime() : null;

  useEffect(() => {
    if (!isTimerRunning || isTimerPaused) {
      localDisplayEpochRef.current = null;
      return;
    }
    if (isLocalStart) {
      if (localDisplayEpochRef.current === null) {
        localDisplayEpochRef.current = Date.now();
      }
    } else if (serverBaseMs == null) {
      return;
    }

    const baseMs: number = isLocalStart
      ? (localDisplayEpochRef.current ?? Date.now())
      : (serverBaseMs as number);

    const pad = (n: number) => String(n).padStart(2, "0");

    const tick = () => {
      const elapsedMs = Date.now() - baseMs - totalPausedDuration;
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
  }, [isTimerRunning, isTimerPaused, isLocalStart, serverBaseMs, totalPausedDuration]);

  // 초기화/종료로 store의 startTime이 비었을 때 표시·일시정지 보정 리셋
  useEffect(() => {
    if (!isTimerRunning && !startTimeFromStore) {
      setHours("00");
      setMinutes("00");
      setSeconds("00");
      setClientStartedAt(null);
      setTotalPausedDuration(0);
      pausedAtRef.current = null;
      localDisplayEpochRef.current = null;
    }
  }, [
    isTimerRunning,
    startTimeFromStore,
    setClientStartedAt,
    setTotalPausedDuration,
  ]);

  const onPauseClick = () => {
    pausedAtRef.current = Date.now();
    setIsTimerPaused(true);
  };
  const onResumeClick = () => {
    const at = pausedAtRef.current;
    if (at != null) {
      setTotalPausedDuration((prev) => prev + (Date.now() - at));
      pausedAtRef.current = null;
    }
    setIsTimerPaused(false);
  };

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
