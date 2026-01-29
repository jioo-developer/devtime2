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
 * Access Token이 없으면 에러를 던짐
 * - 토큰이 없으면 네트워크 요청 자체를 보내지 않고 에러 발생
 * - 리다이렉트는 호출부에서 처리해야 함
 */
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export function getAccessTokenOrThrow(
  getAccessToken: () => string | null,
): string {
  const token = getAccessToken();
  if (!token) {
    throw new UnauthorizedError("Access token is required");
  }
  return token;
}
