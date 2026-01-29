import { useModalStore } from "@/store/modalStore";
import React from "react";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useRouter, useSearchParams } from "next/navigation";
import { safeInternalPath } from "@/utils/pathUtils";
import {
  setAccessTokenExpiry,
  setRefreshTokenExpiry,
} from "@/utils/cookieUtils";
import type { LoginResponse } from "./types";

export const handleDuplicateLogin = (
  result: LoginResponse,
  router: ReturnType<typeof useRouter>,
  searchParams: ReturnType<typeof useSearchParams>,
) => {
  const push = useModalStore.getState().push;
  const closeTop = useModalStore.getState().closeTop;

  // 중복 로그인된 다른 기기가 존재하는 경우 안내 메시지 표시
  push({
    title: "중복 로그인",
    content: "다른 기기에서 로그인되어 기존 기기의 로그인이 해제되었습니다.",
    footer: React.createElement(
      CommonButton,
      {
        theme: "primary",
        onClick: () => {
          closeTop();
          // 토큰 저장 및 리다이렉트
          if (result.accessToken) {
            localStorage.setItem("accessToken", result.accessToken);
            setAccessTokenExpiry();
          }
          if (result.refreshToken) {
            localStorage.setItem("refreshToken", result.refreshToken);
            setRefreshTokenExpiry();
          }

          // isFirstLogin이 true면 /profile로, 아니면 redirect 파라미터 또는 /로 이동
          if (result.isFirstLogin) {
            router.replace("/profile");
          } else {
            const redirectParam = safeInternalPath(
              searchParams.get("redirect"),
            );
            router.replace(redirectParam ?? "/");
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      "확인",
    ),
    BackdropMiss: false,
  });
};
