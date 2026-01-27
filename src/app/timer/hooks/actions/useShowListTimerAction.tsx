"use client";

import React from "react";
import { useModalStore } from "@/store/modalStore";
import { EditFormModalContent } from "@/app/timer/component/Form/modalContents";

const EDIT_MODAL_OPTIONS = {
  width: 640,
  height: 828,
  title: null as null,
  showCloseButton: false as const,
  footer: null,
  BackdropMiss: false as const,
};

export function useShowListTimerAction() {
  const openModal = useModalStore.getState().push;

  const showListTimer = (studyLogId?: string) => {
    openModal({
      ...EDIT_MODAL_OPTIONS,
      content: <EditFormModalContent studyLogId={studyLogId} />,
    });
  };

  return { showListTimer };
}
