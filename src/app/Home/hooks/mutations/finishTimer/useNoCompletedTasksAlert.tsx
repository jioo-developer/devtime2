"use client";

import React from "react";
import { useModalStore } from "@/store/modalStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

/**
 * "완료한 일이 없습니다" 알림 모달을 띄우는 훅.
 * 책임: 해당 알림 UI·옵션만 관리.
 */
export function useNoCompletedTasksAlert() {
  const openModal = useModalStore((state) => state.push);
  const closeTop = useModalStore((state) => state.closeTop);

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

  return { showNoCompletedTasksAlert };
}
