import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { AuthFormData } from "../Client";
import { useModalStore } from "@/store/modalStore";
import React from "react";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

export const useSignup = () => {
  const push = useModalStore((state) => state.push);

  return useMutation({
    mutationFn: (data: AuthFormData) => {
      const payload = {
        email: data.email,
        nickname: data.nickname,
        password: data.password,
        confirmPassword: data.passwordConfirmation,
      };
      return ApiClient.post("/api/signup", payload);
    },
    onSuccess: () => {
      const closeTop = useModalStore.getState().closeTop;
      push({
        title: "회원가입 성공",
        content: "회원가입이 완료되었습니다.",
        footer: React.createElement(
          CommonButton,
          {
            theme: "primary",
            onClick: () => closeTop(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          "확인",
        ),
        BackdropMiss: false,
      });
    },
    onError: (error) => {
      const closeTop = useModalStore.getState().closeTop;
      const errorMessage =
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.";

      push({
        title: "회원가입 실패",
        content: errorMessage,
        footer: React.createElement(
          CommonButton,
          {
            theme: "primary",
            onClick: () => closeTop(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          "확인",
        ),
        BackdropMiss: false,
      });
    },
  });
};
