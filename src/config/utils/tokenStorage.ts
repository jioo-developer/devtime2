import {
  isAccessTokenValid,
  isRefreshTokenValid,
  setAccessTokenExpiry,
  setRefreshTokenExpiry,
  clearTokenExpiryCookies,
} from "@/utils/cookieUtils";

/**
 * Access Token 조회
 * - 쿠키에서 만료 시간 확인 후 유효하면 localStorage에서 반환
 * - 만료되었으면 localStorage에서 삭제하고 null 반환
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  // 쿠키에서 만료 시간 확인
  if (!isAccessTokenValid()) {
    // 만료되었으면 localStorage 삭제
    try {
      window.localStorage.removeItem("accessToken");
    } catch {
      // ignore
    }
    return null;
  }

  try {
    return window.localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

/**
 * Refresh Token 조회
 * - 쿠키에서 만료 시간 확인 후 유효하면 localStorage에서 반환
 * - 만료되었으면 localStorage에서 삭제하고 null 반환
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;

  // 쿠키에서 만료 시간 확인
  if (!isRefreshTokenValid()) {
    // 만료되었으면 localStorage 삭제
    try {
      window.localStorage.removeItem("refreshToken");
      window.localStorage.removeItem("accessToken"); // Refresh Token 만료 시 Access Token도 삭제
    } catch {
      // ignore
    }
    return null;
  }

  try {
    return window.localStorage.getItem("refreshToken");
  } catch {
    return null;
  }
}

/**
 * 토큰 저장
 * - localStorage에 저장하고 쿠키에 만료 시간 설정
 */
export function setTokens(accessToken?: string, refreshToken?: string) {
  if (typeof window === "undefined") return;
  try {
    if (accessToken) {
      window.localStorage.setItem("accessToken", accessToken);
      setAccessTokenExpiry(); // Access Token 만료 시간 쿠키 설정
    }
    if (refreshToken) {
      window.localStorage.setItem("refreshToken", refreshToken);
      setRefreshTokenExpiry(); // Refresh Token 만료 시간 쿠키 설정
    }
  } catch {
    // ignore
  }
}

/**
 * 토큰 삭제
 * - localStorage와 쿠키에서 모두 삭제
 */
export function clearTokens() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    clearTokenExpiryCookies(); // 쿠키도 삭제
  } catch {
    // ignore
  }
}
