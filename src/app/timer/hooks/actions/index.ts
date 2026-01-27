"use client";

import { useStartTimerAction } from "./useStartTimerAction";
import { useShowListTimerAction } from "./useShowListTimerAction";
import { useResetTimerAction } from "./useResetTimerAction";
import { useFinishTimerAction } from "./useFinishTimerAction";
import { usePauseTimerAction } from "./usePauseTimerAction";

export { useStartTimerAction } from "./useStartTimerAction";
export { useShowListTimerAction } from "./useShowListTimerAction";
export { useResetTimerAction } from "./useResetTimerAction";
export { useFinishTimerAction } from "./useFinishTimerAction";
export type { OpenEditModalFn } from "./useFinishTimerAction";
export { usePauseTimerAction } from "./usePauseTimerAction";

/**
 * 타이머 시작/일시정지/종료/초기화 등 액션을 묶어서 반환.
 * 구현은 각각 이 폴더의 use*Action 파일에서 찾을 수 있다.
 */
export function useTimerActions() {
  const { startTimer } = useStartTimerAction();
  const { showListTimer } = useShowListTimerAction();
  const { resetTimer } = useResetTimerAction();
  const { finishTimer } = useFinishTimerAction(showListTimer);
  const { pauseTimer } = usePauseTimerAction();

  return {
    startTimer,
    pauseTimer,
    showListTimer,
    resetTimer,
    finishTimer,
  };
}
