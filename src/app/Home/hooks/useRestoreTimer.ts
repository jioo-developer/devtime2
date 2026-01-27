"use client";

import { useEffect, useRef } from "react";
import type { TimerResponse } from "./getter/useGetTimers";
import type { StudyLogData } from "./getter/useGetStudyLog";
import { useTimerStore } from "@/store/timerStore";

export function useRestoreTimer(
  timerData: TimerResponse | undefined,
  studyLogData: StudyLogData | undefined
) {
  const setIsTimerRunning = useTimerStore((state) => state.setIsTimerRunning);
  const setIsTimerPaused = useTimerStore((state) => state.setIsTimerPaused);
  const setTodoTitle = useTimerStore((state) => state.setTodoTitle);
  const setSavedTodos = useTimerStore((state) => state.setSavedTodos);
  const setTotalPausedDuration = useTimerStore((state) => state.setTotalPausedDuration);
  const restoredTimerKeyRef = useRef<string | null>(null);

  const timerKey =
    timerData?.timerId && timerData?.startTime
      ? `${timerData.timerId}:${timerData.startTime}`
      : null;

  useEffect(() => {
    if (!timerKey) {
      setIsTimerRunning(false);
      setIsTimerPaused(false);
      restoredTimerKeyRef.current = null;
      return;
    }

    const isNewOrPageRestore = restoredTimerKeyRef.current !== timerKey;
    restoredTimerKeyRef.current = timerKey;

    setIsTimerRunning(true);
    if (isNewOrPageRestore) {
      setIsTimerPaused(false);
      setTotalPausedDuration(0);
    }

    if (studyLogData) {
      setTodoTitle(studyLogData.data.todayGoal);
      setSavedTodos(studyLogData.data.tasks.map((task) => task.content));
    }
  }, [
    timerKey,
    studyLogData,
    setIsTimerRunning,
    setIsTimerPaused,
    setTodoTitle,
    setSavedTodos,
    setTotalPausedDuration,
  ]);
}
