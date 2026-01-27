"use client";

import React from "react";
import { useModalStore } from "@/store/modalStore";
import { EndFormModalContent } from "@/app/timer/component/Form/modalContents";

const END_MODAL_OPTIONS = {
  width: 640,
  height: 828,
  title: null as null,
  showCloseButton: false as const,
  footer: null,
  BackdropMiss: false as const,
};

export type OpenEditModalFn = (studyLogId?: string) => void;

export function useFinishTimerAction(openEditModal: OpenEditModalFn) {
  const openModal = useModalStore.getState().push;
  const closeModal = useModalStore.getState().closeTop;

  const finishTimer = (
    timerId?: string,
    startTime?: string,
    studyLogId?: string,
    pausedDuration?: number
  ) => {
    openModal({
      ...END_MODAL_OPTIONS,
      content: (
        <EndFormModalContent
          timerId={timerId}
          startTime={startTime}
          pausedDuration={pausedDuration}
          onEditClick={() => {
            closeModal();
            openEditModal(studyLogId);
          }}
        />
      ),
    });
  };

  return { finishTimer };
}
