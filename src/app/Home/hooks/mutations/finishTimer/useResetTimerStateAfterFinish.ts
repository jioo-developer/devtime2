"use client";

import { useModalStore } from "@/store/modalStore";
import { useTimerStore } from "@/store/timerStore";

/**
 * 종료 플로우 이후에 타이머 스토어를 초기화하고 최상단 모달을 닫는 훅.
 * 책임: "종료 완료 시" 상태 클리어 + 모달 닫기만 담당.
 */
export function useResetTimerStateAfterFinish() {
  const resetTimerStateAfterFinish = () => {
    const timerActions = useTimerStore.getState();
    const closeTop = useModalStore.getState().closeTop;
    timerActions.setIsTimerRunning(false);
    timerActions.setIsTimerPaused(false);
    timerActions.setStartTime("");
    timerActions.setClientStartedAt(null);
    timerActions.setTotalPausedDuration(0);
    timerActions.setTimerEndedAt(null);
    timerActions.setTodoTitle("오늘도 열심히 달려봐요!");
    timerActions.setSavedTodos([]);
    closeTop();
  };

  return { resetTimerStateAfterFinish };
}
