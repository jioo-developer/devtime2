/**
 * 인증 관련 유틸리티 함수
 * localStorage에서 accessToken을 가져와 Authorization 헤더를 생성
 */

/**
 * localStorage에서 accessToken을 가져와 Authorization 헤더를 반환
 * @returns Authorization 헤더가 포함된 HeadersInit 객체 또는 빈 객체
 */
export const getAuthHeaders = (): HeadersInit => {
  const accessToken =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessToken")
      : null;

  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};
