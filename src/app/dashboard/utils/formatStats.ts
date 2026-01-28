/**
 * 대시보드 통계 표시용 포맷 (ms 기준, Home utils와 동일)
 */

/** ms → "N시간 N분" (초 생략). 누적/평균 공부 시간용 */
export function formatMsToHoursMinutes(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

/** ms → "N시간 N분 N초". 히트맵 툴팁용 */
export function formatMsToHoursMinutesSeconds(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);
  parts.push(`${seconds}초`);
  return parts.join(" ");
}

/** 연속 공부 일수 → "N일째" */
export function formatConsecDays(consecutiveDays: number): string {
  return `${Math.max(0, Math.floor(consecutiveDays))}일째`;
}

/** 0~100 달성률 → "N%" (정수, 소수점 없음) */
export function formatTaskRate(completionRate: number): string {
  return `${Math.min(100, Math.max(0, Math.floor(completionRate)))}%`;
}

/** ms → 시간 수 (바 차트 비율용). 24 이상이면 24로 상한 */
export function msToHours(milliseconds: number, maxHours: number = 24): number {
  const hours = milliseconds / (60 * 60 * 1000);
  return Math.min(maxHours, Math.max(0, hours));
}

/** 분 → "N시간 N분". 학습 기록 공부 시간용 */
export function formatMinToHm(totalMinutes: number): string {
  return formatMsToHoursMinutes(totalMinutes * 60 * 1000);
}

/** 시간(소수) → "N시간 N분 N초". 히트맵 툴팁용 (studyTimeHours) */
export function formatHrToHms(hoursDecimal: number): string {
  const totalSeconds = Math.max(0, Math.round(hoursDecimal * 3600));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0) parts.push(`${minutes}분`);
  parts.push(`${seconds}초`);
  return parts.join(" ");
}
