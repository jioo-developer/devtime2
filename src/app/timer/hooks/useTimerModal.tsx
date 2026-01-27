"use client";

import React from "react";
import { useModalStore } from "@/store/modalStore";
import ModalForm from "../component/Form/components/ModalForm";
import type { FormMode } from "../component/Form/types";

export function useTimerModal() {
  const openModal = useModalStore.getState().push;

  const openTimerModal = (mode: FormMode) => {
    openModal({
      width: 640,
      height: 815,
      showCloseButton: false,
      footer: null,
      BackdropMiss: false,
      content: <ModalForm mode={mode} />,
    });
  };

  return { openTimerModal };
}
