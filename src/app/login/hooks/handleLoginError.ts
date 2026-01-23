import { useModalStore } from "@/store/modalStore";
import React from "react";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

export const handleLoginError = () => {
  const push = useModalStore.getState().push;
  const closeTop = useModalStore.getState().closeTop;

  push({
    title: "로그인 실패",
    content: "로그인 정보를 다시 확인해 주세요.",
    footer: React.createElement(
      CommonButton,
      {
        theme: "primary",
        onClick: () => {
          closeTop();
          // 모달 닫은 후 이메일 입력창으로 포커스 이동
          setTimeout(() => {
            const emailInput = document.querySelector(
              '[data-testid="email-input"]',
            ) as HTMLInputElement;
            emailInput?.focus();
          }, 0);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      "확인",
    ),
    BackdropMiss: false,
    onClose: () => {
      // 모달 닫을 때 이메일 입력창으로 포커스 이동
      setTimeout(() => {
        const emailInput = document.querySelector(
          '[data-testid="email-input"]',
        ) as HTMLInputElement;
        emailInput?.focus();
      }, 0);
    },
  });
};
