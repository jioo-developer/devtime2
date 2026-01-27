import { useRouter, useSearchParams } from "next/navigation";
import { safeInternalPath } from "@/utils/pathUtils";
import {
  setAccessTokenExpiry,
  setRefreshTokenExpiry,
} from "@/utils/cookieUtils";
import type { LoginResponse } from "./types";

export const handleNormalLogin = (
  result: LoginResponse,
  router: ReturnType<typeof useRouter>,
  searchParams: ReturnType<typeof useSearchParams>,
) => {
  // 토큰 저장
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
};
