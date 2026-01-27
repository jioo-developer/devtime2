/**
 * 안전한 내부 경로인지 검증
 * - null/undefined 체크
 * - "/"로 시작하는지 확인
 * - "//" 또는 "\\" 같은 위험한 경로 차단
 */
export function safeInternalPath(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.includes("\\")) return null;
  return value;
}
