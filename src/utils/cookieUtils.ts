/**
 * 쿠키 유틸리티 함수
 * 토큰 만료 시간을 쿠키에 저장하여 자동 만료 관리
 */

const ACCESS_TOKEN_EXPIRY_COOKIE = "accessTokenExpiry";
const REFRESH_TOKEN_EXPIRY_COOKIE = "refreshTokenExpiry";

/**
 * 쿠키 설정
 */
function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * 쿠키 조회
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }
  return null;
}

/**
 * 쿠키 삭제
 */
function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Access Token 만료 시간 설정 (1시간 = 3600초)
 */
export function setAccessTokenExpiry() {
  const maxAge = 3600; // 1시간
  const expiryTime = Date.now() + maxAge * 1000;
  setCookie(ACCESS_TOKEN_EXPIRY_COOKIE, expiryTime.toString(), maxAge);
}

/**
 * Refresh Token 만료 시간 설정 (10일 = 864000초)
 */
export function setRefreshTokenExpiry() {
  const maxAge = 864000; // 10일
  const expiryTime = Date.now() + maxAge * 1000;
  setCookie(REFRESH_TOKEN_EXPIRY_COOKIE, expiryTime.toString(), maxAge);
}

/**
 * Access Token 만료 시간 확인
 * @returns 만료되지 않았으면 true, 만료되었거나 없으면 false
 */
export function isAccessTokenValid(): boolean {
  const expiry = getCookie(ACCESS_TOKEN_EXPIRY_COOKIE);
  if (!expiry) return false;
  const expiryTime = parseInt(expiry, 10);
  return !isNaN(expiryTime) && Date.now() < expiryTime;
}

/**
 * Refresh Token 만료 시간 확인
 * @returns 만료되지 않았으면 true, 만료되었거나 없으면 false
 */
export function isRefreshTokenValid(): boolean {
  const expiry = getCookie(REFRESH_TOKEN_EXPIRY_COOKIE);
  if (!expiry) return false;
  const expiryTime = parseInt(expiry, 10);
  return !isNaN(expiryTime) && Date.now() < expiryTime;
}

/**
 * 모든 토큰 만료 쿠키 삭제
 */
export function clearTokenExpiryCookies() {
  deleteCookie(ACCESS_TOKEN_EXPIRY_COOKIE);
  deleteCookie(REFRESH_TOKEN_EXPIRY_COOKIE);
}
