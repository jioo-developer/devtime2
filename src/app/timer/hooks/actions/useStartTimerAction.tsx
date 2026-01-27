"use client";

import React from "react";
import { useModalStore } from "@/store/modalStore";
import { useTimerContext } from "@/app/timer/provider/TimerContext";
import { useTimerMutations } from "../mutations";
import { getCurrentSplitTimes } from "@/app/timer/utils/calculateSplitTimes";
import { CreateFormModalContent } from "@/app/timer/component/Form/modalContents";

const CREATE_MODAL_OPTIONS = {
  width: 640,
  height: 828,
  showCloseButton: false as const,
  footer: null,
  BackdropMiss: false as const,
};

export function useStartTimerAction() {
  const openModal = useModalStore.getState().push;
  const { isTimerPaused, setIsTimerPaused } = useTimerContext();
  const { resumeTimerMutation } = useTimerMutations();

  const startTimer = (timerId?: string, startTime?: string, pausedDuration?: number) => {
    if (isTimerPaused && timerId && startTime) {
      const splitTimes = getCurrentSplitTimes(startTime, pausedDuration ?? 0);
      resumeTimerMutation.mutate(
        { timerId, splitTimes },
        { onSuccess: () => setIsTimerPaused(false) }
      );
      return;
    }
    openModal({
      ...CREATE_MODAL_OPTIONS,
      content: <CreateFormModalContent />,
    });
  };

  return { startTimer };
}
