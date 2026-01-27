"use client";

import React from "react";
import { useModalStore } from "@/store/modalStore";
import { useTimerContext } from "@/app/timer/provider/TimerContext";
import { useTimerMutations } from "../mutations";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

const RESET_MODAL_OPTIONS = {
  width: 360,
  title: "기록을 초기화 하시겠습니까?",
  content: "진행되던 타이머 기록은 삭제되고, 복구가 불가능합니다. 계속 초기화할까요?",
  showCloseButton: false as const,
  BackdropMiss: true as const,
};

export function useResetTimerAction() {
  const openModal = useModalStore.getState().push;
  const closeModal = useModalStore.getState().closeTop;
  const { setIsTimerRunning, setIsTimerPaused, setTodoTitle, setSavedTodos } = useTimerContext();
  const { resetTimerMutation } = useTimerMutations();

  const clearAndClose = () => {
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setTodoTitle("");
    setSavedTodos([]);
    setTodoTitle("오늘도 열심히 달려봐요!");
    closeModal();
  };

  const resetTimer = (timerId?: string) => {
    openModal({
      ...RESET_MODAL_OPTIONS,
      footer: (
        <>
          <CommonButton theme="secondary" onClick={() => closeModal()}>
            취소
          </CommonButton>
          <CommonButton
            theme="primary"
            onClick={() => {
              if (timerId) {
                resetTimerMutation.mutate(
                  { timerId },
                  {
                    onSuccess: clearAndClose,
                    onError: (error: Error) => {
                      console.error("타이머 초기화 실패:", error);
                      closeModal();
                    },
                  }
                );
              } else {
                clearAndClose();
              }
            }}
          >
            초기화하기
          </CommonButton>
        </>
      ),
    });
  };

  return { resetTimer };
}
