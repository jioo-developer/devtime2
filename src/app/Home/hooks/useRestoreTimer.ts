import { useEffect } from "react";
import { useTimerContext } from "../provider/TimerContext";
import { TimerResponse } from "./useGetTimers";

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

  useEffect(() => {
    if (!timerData) return;

    const isRunning = Boolean(timerData.timerId && timerData.startTime);

    if (isRunning) {
      // 타이머가 진행 중인 경우
      setIsTimerRunning(true);
      setIsTimerPaused(false);
      // TODO: 서버에서 title과 todos도 받아와서 복원
      // 현재는 API 응답에 title과 todos가 없으므로 나중에 추가 필요
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
    setIsTimerRunning,
    setIsTimerPaused,
    setSavedTitle,
    setSavedTodos,
    setTodoTitle,
  ]);
}
