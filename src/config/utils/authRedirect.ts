import { clearTokens } from "./tokenStorage";

/**
 * 로그인 페이지로 리다이렉트
 * - 현재 URL을 redirect 파라미터로 전달
 */
export function redirectToLogin() {
  if (typeof window === "undefined") return;
  const current =
    window.location.pathname + window.location.search + window.location.hash;
  const redirect = encodeURIComponent(current || "/");
  window.location.replace(`/login?redirect=${redirect}`);
}

/**
 * Access Token이 없으면 로그인 페이지로 리다이렉트
 * - 토큰이 없으면 네트워크 요청 자체를 보내지 않고 즉시 로그인으로 이동
 */
export function ensureAccessTokenOrRedirect(
  getAccessToken: () => string | null,
): string | null {
  const token = getAccessToken();
  if (token) return token;
  // 토큰이 아예 없으면 네트워크 요청 자체를 보내지 않고 즉시 로그인으로
  clearTokens();
  redirectToLogin();
  return null;
}
