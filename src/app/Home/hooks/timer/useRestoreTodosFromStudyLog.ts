"use client";

import { useEffect } from "react";
import type { StudyLogData } from "../getter/useGetStudyLog";
import { useTimerStore } from "@/store/timerStore";
import { useShallow } from "zustand/react/shallow";

/**
 * studyLogData로부터 투두 UI 상태(todoTitle, savedTodos)만 복구한다.
 * - 타이머 running/paused 같은 도메인 상태는 다루지 않는다.
 */
export function useRestoreTodosFromStudyLog(
  studyLogData: StudyLogData | undefined
) {
  const { setTodoTitle, setSavedTodos } = useTimerStore(
    useShallow((state) => ({
      setTodoTitle: state.setTodoTitle,
      setSavedTodos: state.setSavedTodos,
    }))
  );

  useEffect(() => {
    if (!studyLogData) return;

    const todayGoal = studyLogData.data.todayGoal;
    const tasks = studyLogData.data.tasks.map((task) => task.content);

    setTodoTitle(todayGoal);
    setSavedTodos(tasks);
  }, [studyLogData, setTodoTitle, setSavedTodos]);
}
