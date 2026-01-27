"use client";

import React from "react";
import { useModalStore } from "@/store/modalStore";
import ModalForm from "@/app/timer/component/Form/components/ModalForm";

const END_MODAL_OPTIONS = {
  width: 640,
  height: 828,
  showCloseButton: false as const,
  footer: null,
  BackdropMiss: false as const,
};

export function useFinishTimerAction() {
  const openModal = useModalStore.getState().push;

  const finishTimer = (
    timerId?: string,
    startTime?: string,
    studyLogId?: string,
    pausedDuration?: number
  ) => {
    const endOptions =
      timerId && startTime
        ? {
            timerId,
            startTime,
            pausedDuration: pausedDuration ?? 0,
            endTime: new Date().toISOString(),
          }
        : undefined;

    openModal({
      ...END_MODAL_OPTIONS,
      content: (
        <ModalForm
          mode="end"
          studyLogId={studyLogId}
          endOptions={endOptions}
        />
      ),
    });
  };

  return { finishTimer };
}
