import React from "react";
import { useModalStore } from "@/store/modalStore";
import { useTimerStore } from "@/store/timerStore";
import { useFinishTimer } from "@/app/Home/hooks/mutations/useFinishTimer";
import { buildSplitTimesForStop, applySafetyBuffer } from "@/app/Home/utils/splitTimesForStop";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import type { ModalFormEndOptions } from "../components/ModalForm";

type TodoTask = {
  content: string;
  isCompleted: boolean;
};

export function useFinishTimerAction() {
  const { mutate: finishTimer } = useFinishTimer();
  const openModal = useModalStore((state) => state.push);
  const closeTop = useModalStore((state) => state.closeTop);
  const timerActions = useTimerStore.getState();

  const showNoCompletedTasksAlert = () => {
    openModal({
      width: 360,
      title: "알림",
      content: (
        <>
          완료한 일이 없습니다.
          <br />
          할일 목록을 다시 한번 확인해주시겠어요?
        </>
      ),
      showCloseButton: false,
      BackdropMiss: true,
      footer: (
        <CommonButton theme="primary" onClick={() => closeTop()}>
          확인
        </CommonButton>
      ),
    });
  };

  const resetTimerState = () => {
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

  const finishTimerAction = (
    endOptions: ModalFormEndOptions,
    tasks: TodoTask[],
    reflection: string,
    completedCount: number
  ) => {
    if (completedCount === 0) {
      showNoCompletedTasksAlert();
      return;
    }

    const { timerId, startTime, pausedDuration = 0, endTime: endTimeFromProps } = endOptions;

    const endTimeStr = endTimeFromProps ?? useTimerStore.getState().timerEndedAt;
    const endTime = endTimeStr ? new Date(endTimeStr) : new Date();

    const splitTimes = buildSplitTimesForStop(startTime, endTime, pausedDuration);
    const rawRangeMs = Math.max(0, endTime.getTime() - new Date(startTime).getTime() - pausedDuration);
    const allowedSec = Math.floor(rawRangeMs / 1000);
    const safeSec = Math.max(0, allowedSec - 10);

    const payloadSplitTimes = applySafetyBuffer(splitTimes, safeSec);

    finishTimer(
      {
        timerId,
        data: {
          splitTimes: payloadSplitTimes,
          tasks,
          review: reflection,
        },
      },
      {
        onSuccess: resetTimerState,
        onError: (err) => {
          console.error("공부 완료 처리 실패:", err);
        },
      }
    );
  };

  return { finishTimerAction };
}
