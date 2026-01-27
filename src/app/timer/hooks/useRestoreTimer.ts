"use client";

import { useEffect } from "react";
import type { TimerResponse } from "./useGetTimers";
import type { StudyLogData } from "./useGetStudyLog";
import { useTimerStore } from "@/store/timerStore";

export function useRestoreTimer(
  timerData: TimerResponse | undefined,
  studyLogData: StudyLogData | undefined
) {
  const setIsTimerRunning = useTimerStore((state) => state.setIsTimerRunning);
  const setIsTimerPaused = useTimerStore((state) => state.setIsTimerPaused);
  const setTodoTitle = useTimerStore((state) => state.setTodoTitle);
  const setSavedTodos = useTimerStore((state) => state.setSavedTodos);

  useEffect(() => {
    if (timerData?.timerId && timerData?.startTime) {
      setIsTimerRunning(true);
      setIsTimerPaused(false);
      if (studyLogData) {
        setTodoTitle(studyLogData.data.todayGoal);
        setSavedTodos(studyLogData.data.tasks);
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
  ]);
}
