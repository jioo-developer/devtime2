"use client";

import { useTimerStore } from "@/store/timerStore";
import { useFinishTimer } from "./useFinishTimer";
import { useNoCompletedTasksAlert } from "./useNoCompletedTasksAlert";
import { useResetTimerStateAfterFinish } from "./useResetTimerStateAfterFinish";
import { buildFinishTimerPayload } from "@/app/Home/utils/buildFinishTimerPayload";
import type { ModalFormEndOptions } from "@/app/Home/component/Form/components/ModalForm";
import type { FinishTimerTaskItem } from "./useFinishTimer";

/**
 * 종료 플로우 오케스트레이션만 담당.
 * - 검증(완료 개수) → 알림 모달 / 페이로드 생성 → mutation → 종료 후 초기화는 각각 하위 훅·유틸에 위임.
 */
export function useFinishTimerAction() {
  const { mutate: finishTimer } = useFinishTimer();
  const { showNoCompletedTasksAlert } = useNoCompletedTasksAlert();
  const { resetTimerStateAfterFinish } = useResetTimerStateAfterFinish();

  const finishTimerAction = (
    endOptions: ModalFormEndOptions,
    tasks: FinishTimerTaskItem[],
    reflection: string,
    completedCount: number
  ) => {
    if (completedCount === 0) {
      showNoCompletedTasksAlert();
      return;
    }

    const endTimeOverride = useTimerStore.getState().timerEndedAt ?? null;
    const payload = buildFinishTimerPayload({
      timerId: endOptions.timerId,
      startTime: endOptions.startTime,
      pausedDuration: endOptions.pausedDuration,
      endTime: endOptions.endTime ?? endTimeOverride,
      tasks,
      review: reflection,
    });

    finishTimer(payload, {
      onSuccess: resetTimerStateAfterFinish,
      onError: (err) => {
        console.error("공부 완료 처리 실패:", err);
      },
    });
  };

  return { finishTimerAction };
}
