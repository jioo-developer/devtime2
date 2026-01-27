/**
 * 서버 stop API용: splitTimes[].date는 "해당 구간의 시작 시각" ISO.
 * timeSpent는 초(seconds) 정수이며, 전체 합은 floor((end-start-paused)/1000)와 같게 맞춤.
 */

/** 구간 시작 시각 ISO + 해당 구간에 쓴 시간(초). stop API 전송용 */
export type SplitTimeForStop = {
  date: string; // 구간 시작 시각 ISO (예: startTime 또는 자정 경계 "…T00:00:00.000Z")
  timeSpent: number; // seconds (정수)
};

/**
 * start ~ end 구간을 UTC 자정 기준으로 쪼갠 뒤, 각 chunk의 시작 시각을 date로 하는 split 생성.
 * 합계 = allowedSec = floor((end - start - paused) / 1000). 비율 배분 후 floor, 나머지는 마지막 구간에.
 */
export function buildSplitTimesForStop(
  startTime: string,
  endTime: Date,
  pausedDurationMs: number = 0
): SplitTimeForStop[] {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const totalMs = Math.max(0, end.getTime() - start.getTime() - pausedDurationMs);
  const allowedSec = Math.floor(totalMs / 1000);
  if (allowedSec <= 0) return [];

  const startMidnightUtc = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0, 0)
  );
  const endMidnightUtc = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 0, 0, 0, 0)
  );

  type Chunk = { startDate: Date; durationMs: number };
  const chunks: Chunk[] = [];

  if (startMidnightUtc.getTime() === endMidnightUtc.getTime()) {
    chunks.push({ startDate: start, durationMs: totalMs });
  } else {
    const firstEnd = new Date(startMidnightUtc);
    firstEnd.setUTCDate(firstEnd.getUTCDate() + 1);
    const firstMs = firstEnd.getTime() - start.getTime();
    chunks.push({ startDate: start, durationMs: firstMs });

    let cur = new Date(firstEnd);
    while (cur.getTime() < endMidnightUtc.getTime()) {
      const next = new Date(cur);
      next.setUTCDate(next.getUTCDate() + 1);
      chunks.push({ startDate: new Date(cur), durationMs: next.getTime() - cur.getTime() });
      cur = next;
    }
    const lastMs = end.getTime() - endMidnightUtc.getTime();
    if (lastMs > 0) {
      chunks.push({ startDate: new Date(endMidnightUtc), durationMs: lastMs });
    }
  }

  const totalRawMs = chunks.reduce((s, c) => s + c.durationMs, 0);
  const ratio = totalRawMs > 0 ? allowedSec / (totalRawMs / 1000) : 0;
  const result: SplitTimeForStop[] = chunks.map((c) => ({
    date: c.startDate.toISOString(),
    timeSpent: Math.max(0, Math.floor((c.durationMs / 1000) * ratio)),
  }));

  const sum = result.reduce((a, r) => a + r.timeSpent, 0);
  if (sum < allowedSec && result.length > 0) {
    result[result.length - 1].timeSpent += allowedSec - sum;
  }

  return result;
}

// ——— 기존 (getCurrentSplitTimes 등에서 사용, date=자정 키 / timeSpent=ms) ———

export type SplitTime = {
  date: string; // UTC 자정 ISO (날짜 키 용도)
  timeSpent: number; // 밀리초
};

function toUTCMidnightISO(date: Date): string {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  return new Date(Date.UTC(y, m, d, 0, 0, 0, 0)).toISOString();
}

export function calculateSplitTimes(
  startTime: string,
  endTime: Date = new Date(),
  pausedDuration: number = 0
): SplitTime[] {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const totalTimeSpent = end.getTime() - start.getTime() - pausedDuration;
  if (totalTimeSpent <= 0) return [];

  const startMidnightUtc = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0, 0)
  );
  const endMidnightUtc = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 0, 0, 0, 0)
  );

  if (startMidnightUtc.getTime() === endMidnightUtc.getTime()) {
    return [{ date: toUTCMidnightISO(start), timeSpent: Math.max(0, totalTimeSpent) }];
  }

  const firstDayEndUtc = new Date(startMidnightUtc);
  firstDayEndUtc.setUTCDate(firstDayEndUtc.getUTCDate() + 1);
  const firstDayTime = firstDayEndUtc.getTime() - start.getTime();

  const currentDay = new Date(startMidnightUtc);
  currentDay.setUTCDate(currentDay.getUTCDate() + 1);
  const middleDays: { date: Date; timeSpent: number }[] = [];
  while (currentDay.getTime() < endMidnightUtc.getTime()) {
    const dayEnd = new Date(currentDay);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
    middleDays.push({ date: new Date(currentDay), timeSpent: dayEnd.getTime() - currentDay.getTime() });
    currentDay.setUTCDate(currentDay.getUTCDate() + 1);
  }

  const lastDayTime = end.getTime() - endMidnightUtc.getTime();
  const totalRawTime =
    firstDayTime + middleDays.reduce((s, d) => s + d.timeSpent, 0) + lastDayTime;
  const adjustmentRatio = totalRawTime > 0 ? totalTimeSpent / totalRawTime : 0;

  const splitTimes: SplitTime[] = [];
  const adjustedFirst = Math.max(0, Math.floor(firstDayTime * adjustmentRatio));
  splitTimes.push({ date: toUTCMidnightISO(start), timeSpent: adjustedFirst });
  let totalAdjusted = adjustedFirst;

  middleDays.forEach((day) => {
    const t = Math.max(0, Math.floor(day.timeSpent * adjustmentRatio));
    splitTimes.push({ date: toUTCMidnightISO(day.date), timeSpent: t });
    totalAdjusted += t;
  });

  if (lastDayTime > 0) {
    splitTimes.push({ date: toUTCMidnightISO(end), timeSpent: totalTimeSpent - totalAdjusted });
  } else if (splitTimes.length > 0) {
    splitTimes[0].timeSpent += totalTimeSpent - totalAdjusted;
  }
  return splitTimes;
}

export function getCurrentSplitTimes(startTime?: string, pausedDuration: number = 0): SplitTime[] {
  if (!startTime) return [];
  return calculateSplitTimes(startTime, new Date(), pausedDuration);
}
