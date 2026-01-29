"use client";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { useModalStore } from "@/store/modalStore";
import { useTimerStore } from "@/store/timerStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

type ResetTimerRequest = { timerId: string };
type ResponseMessage = { message: string };

export const useResetTimer = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseMessage, Error, ResetTimerRequest>({
    mutationFn: async ({ timerId }) => {
      return await ApiClient.delete<ResponseMessage>(
        `/api/timers/${timerId}`,
        undefined,
        getAuthHeaders()
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
  });
};

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
  const { mutate: resetTimerMutation } = useResetTimer();

  const {
    setIsTimerRunning,
    setIsTimerPaused,
    setTodoTitle,
    setSavedTodos,
    setStartTime,
    setClientStartedAt,
    setTotalPausedDuration,
  } = useTimerStore(
    useShallow((state) => ({
      setIsTimerRunning: state.setIsTimerRunning,
      setIsTimerPaused: state.setIsTimerPaused,
      setTodoTitle: state.setTodoTitle,
      setSavedTodos: state.setSavedTodos,
      setStartTime: state.setStartTime,
      setClientStartedAt: state.setClientStartedAt,
      setTotalPausedDuration: state.setTotalPausedDuration,
    }))
  );


  const clearAndClose = () => {
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setStartTime("");
    setClientStartedAt(null);
    setTotalPausedDuration(0);
    setTodoTitle("오늘도 열심히 달려봐요!");
    setSavedTodos([]);
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
                resetTimerMutation(
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
