/** UTC 자정 시각 계산 */
export function getUTCMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)
  );
}

/** UTC 자정 ISO 문자열로 변환 */
export function toUTCMidnightISO(date: Date): string {
  return getUTCMidnight(date).toISOString();
}

/** 다음 날 UTC 자정 계산 */
export function getNextDayMidnight(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  return nextDay;
}
