import { getAccessToken, clearTokens } from "./utils/tokenStorage";
import {
  getAccessTokenOrThrow,
  UnauthorizedError,
  redirectToLogin,
} from "./utils/authRedirect";
import { refreshAccessToken } from "./utils/tokenRefresh";

/**
 * 인증된 HTTP 요청 처리
 * - 토큰이 없으면 로그인 페이지로 리다이렉트
 * - 401 에러 발생 시 토큰 갱신 후 1회 재시도
 * - 재시도 후에도 실패하면 로그인 페이지로 리다이렉트
 */
async function request<T>(
  baseUrl: string,
  endpoint: string,
  init: RequestInit & { _retried?: boolean } = {},
): Promise<T> {
  // 최초 요청에서 토큰 없으면 즉시 리다이렉트(왕복 X)
  let token: string | null = null;
  if (!init._retried) {
    try {
      token = getAccessTokenOrThrow(getAccessToken);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        clearTokens();
        redirectToLogin();
      }
      throw error;
    }
  } else {
    token = getAccessToken();
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...init,
    headers,
  });

  if (res.status !== 401) {
    if (!res.ok) throw new Error(`${init.method ?? "GET"} ${endpoint} failed`);
    return res.json();
  }

  // 401 처리: refresh 시도 후 1회 재시도
  if (init._retried) {
    clearTokens();
    redirectToLogin();
    throw new Error(`${init.method ?? "GET"} ${endpoint} unauthorized`);
  }

  const newToken = await refreshAccessToken(baseUrl);
  if (!newToken) {
    clearTokens();
    redirectToLogin();
    throw new Error(`${init.method ?? "GET"} ${endpoint} unauthorized`);
  }

  return request<T>(baseUrl, endpoint, { ...init, _retried: true });
}

export const AuthenticatedApiClient = {
  config: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  /**
   * 수동 토큰 갱신이 필요할 때 사용.
   * - refreshToken이 없거나 refresh 실패 시 null 반환
   * - 성공 시 새 accessToken 반환(및 localStorage 갱신)
   */
  async refresh(): Promise<string | null> {
    const baseUrl = this.config.baseUrl;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
    return refreshAccessToken(baseUrl);
  },

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const baseUrl = this.config.baseUrl;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");

    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    return request<T>(baseUrl, `${endpoint}${queryString}`, { method: "GET" });
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const baseUrl = this.config.baseUrl;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");

    return request<T>(baseUrl, endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};
