import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { useModalStore } from "@/store/modalStore";
import React from "react";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { safeInternalPath } from "@/utils/pathUtils";
import {
  setAccessTokenExpiry,
  setRefreshTokenExpiry,
} from "@/utils/cookieUtils";

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  isFirstLogin: boolean;
  isDuplicateLogin: boolean;
};

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const push = useModalStore((state) => state.push);

  return useMutation({
    mutationFn: (data: LoginData) => {
      const payload = {
        email: data.email,
        password: data.password,
      };
      return ApiClient.post<LoginResponse>("/api/auth/login", payload);
    },
    onSuccess: (result) => {
      if (result.success) {
        if (result.accessToken) {
          localStorage.setItem("accessToken", result.accessToken);
          setAccessTokenExpiry(); // Access Token 만료 시간 쿠키 설정 (1시간)
        }
        if (result.refreshToken) {
          localStorage.setItem("refreshToken", result.refreshToken);
          setRefreshTokenExpiry(); // Refresh Token 만료 시간 쿠키 설정 (10일)
        }

        // isFirstLogin이 true면 /profile로, 아니면 redirect 파라미터 또는 /로 이동
        if (result.isFirstLogin) {
          router.replace("/profile");
        } else {
          const redirectParam = safeInternalPath(searchParams.get("redirect"));
          router.replace(redirectParam ?? "/");
        }
      }
    },
    onError: () => {
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
    },
  });
};
