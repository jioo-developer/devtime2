import { useEffect } from "react";
import { useTimerContext } from "../provider/TimerContext";
import { TimerResponse } from "./useGetTimers";
import { useGetStudyLog } from "./useGetStudyLog";

type UseRestoreTimerParams = {
  timerData: TimerResponse | undefined;
};

export function useRestoreTimer({ timerData }: UseRestoreTimerParams) {
  const {
    setIsTimerRunning,
    setIsTimerPaused,
    setSavedTitle,
    setSavedTodos,
    setTodoTitle,
  } = useTimerContext();

  // studyLogId가 있으면 목표와 할 일 목록 조회
  const { data: studyLogData } = useGetStudyLog(timerData?.studyLogId);

  useEffect(() => {
    if (!timerData) return;

    const isRunning = Boolean(timerData.timerId && timerData.startTime);

    if (isRunning) {
      // 타이머가 진행 중인 경우
      setIsTimerRunning(true);
      setIsTimerPaused(false);
      
      // studyLog에서 목표와 할 일 목록 복원
      if (studyLogData) {
        setSavedTitle(studyLogData.todayGoal);
        setTodoTitle(studyLogData.todayGoal);
        setSavedTodos(studyLogData.tasks);
      }
    } else {
      // 타이머가 없는 경우 초기 상태로 설정
      setIsTimerRunning(false);
      setIsTimerPaused(false);
      setSavedTitle("");
      setSavedTodos([]);
      setTodoTitle("오늘도 열심히 달려봐요!");
    }
  }, [
    timerData,
    studyLogData,
    setIsTimerRunning,
    setIsTimerPaused,
    setSavedTitle,
    setSavedTodos,
    setTodoTitle,
  ]);
}
