"use client";

import { useEffect } from "react";
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
  const setClientStartedAt = useTimerStore((state) => state.setClientStartedAt);
  const setTotalPausedDuration = useTimerStore((state) => state.setTotalPausedDuration);

  useEffect(() => {
    if (timerData?.timerId && timerData?.startTime) {
      setIsTimerRunning(true);
      setIsTimerPaused(false);
      setClientStartedAt(null);
      setTotalPausedDuration(0);
      if (studyLogData) {
        setTodoTitle(studyLogData.data.todayGoal);
        setSavedTodos(studyLogData.data.tasks.map((task) => task.content));
      }
    } else {
      setIsTimerRunning(false);
      setIsTimerPaused(false);
    }
  }, [
    timerData?.timerId,
    timerData?.startTime,
    studyLogData,
    setIsTimerRunning,
    setIsTimerPaused,
    setTodoTitle,
    setSavedTodos,
    setClientStartedAt,
    setTotalPausedDuration,
  ]);
}
