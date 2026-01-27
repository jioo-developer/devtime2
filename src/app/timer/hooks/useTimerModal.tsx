"use client";

import React from "react";
import { useModalStore } from "@/store/modalStore";
import { useTimerStore } from "@/store/timerStore";
import ModalForm from "@/app/timer/component/Form/components/ModalForm";
import type { FormMode } from "@/app/timer/component/Form/types";
import type { ModalFormEndOptions } from "@/app/timer/component/Form/components/ModalForm";

/** mode "end"일 때만 넘기는 인자. useTimerModal 안에서 endOptions로 바꿔서 ModalForm에 넘김 */
export type OpenEndParams = {
  timerId: string;
  startTime: string;
  pausedDuration?: number;
};

export function useTimerModal() {
  const openModal = useModalStore.getState().push;

  const openTimerModal = (
    mode: FormMode,
    studyLogId?: string,
    endParams?: OpenEndParams
  ) => {
    let endOptions: ModalFormEndOptions | undefined;
    if (mode === "end" && endParams) {
      const endedAt = new Date().toISOString();
      useTimerStore.getState().setTimerEndedAt(endedAt);
      endOptions = {
        timerId: endParams.timerId,
        startTime: endParams.startTime,
        pausedDuration: endParams.pausedDuration ?? 0,
        endTime: endedAt,
      };
    }

    openModal({
      width: 640,
      height: 815,
      showCloseButton: false,
      footer: null,
      BackdropMiss: false,
      content: (
        <ModalForm mode={mode} studyLogId={studyLogId} endOptions={endOptions} />
      ),
    });
  };

  return { openTimerModal };
}
