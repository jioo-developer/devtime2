import {
  isAccessTokenValid,
  isRefreshTokenValid,
  setAccessTokenExpiry,
  setRefreshTokenExpiry,
  clearTokenExpiryCookies,
} from "@/utils/cookieUtils";

type RefreshResponse = {
  accessToken?: string;
  refreshToken?: string;
};

let refreshPromise: Promise<string | null> | null = null;

function getAccessToken(): string | null {
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

function getRefreshToken(): string | null {
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

function setTokens(accessToken?: string, refreshToken?: string) {
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

function clearTokens() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    clearTokenExpiryCookies(); // 쿠키도 삭제
  } catch {
    // ignore
  }
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const current =
    window.location.pathname + window.location.search + window.location.hash;
  const redirect = encodeURIComponent(current || "/");
  window.location.replace(`/login?redirect=${redirect}`);
}

function ensureAccessTokenOrRedirect(): string | null {
  const token = getAccessToken();
  if (token) return token;
  // 토큰이 아예 없으면 네트워크 요청 자체를 보내지 않고 즉시 로그인으로
  clearTokens();
  redirectToLogin();
  return null;
}

async function refreshAccessToken(baseUrl: string): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  // 단일 락: 동시에 여러 401이 터져도 refresh는 1번만
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = (await res.json().catch(() => null)) as RefreshResponse | null;
    const newAccessToken = data?.accessToken ?? null;
    if (!newAccessToken) return null;

    setTokens(newAccessToken, data?.refreshToken);
    return newAccessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function request<T>(
  baseUrl: string,
  endpoint: string,
  init: RequestInit & { _retried?: boolean } = {},
): Promise<T> {
  // 최초 요청에서 토큰 없으면 즉시 리다이렉트(왕복 X)
  if (!init._retried) {
    const token = ensureAccessTokenOrRedirect();
    if (!token) throw new Error(`${init.method ?? "GET"} ${endpoint} unauthorized`);
  }

  const token = getAccessToken();

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
