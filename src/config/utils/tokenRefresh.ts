import { getRefreshToken, setTokens } from "./tokenStorage";

type RefreshResponse = {
  accessToken?: string;
  refreshToken?: string;
};

let refreshPromise: Promise<string | null> | null = null;

/**
 * Access Token 갱신
 * - 단일 락: 동시에 여러 401이 발생해도 refresh는 1번만 실행
 * - refreshToken이 없거나 refresh 실패 시 null 반환
 * - 성공 시 새 accessToken 반환(및 localStorage 갱신)
 */
export async function refreshAccessToken(
  baseUrl: string,
): Promise<string | null> {
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
