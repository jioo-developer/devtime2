import { getUTCMidnight, getNextDayMidnight } from "./dateUtils";

export type SplitTimeForStop = {
  date: string;
  timeSpent: number;
};

type TimeChunk = {
  startDate: Date;
  durationMs: number;
};

/** 시작~종료 구간을 날짜별 chunk로 분할 */
function splitByDays(start: Date, end: Date, totalMs: number): TimeChunk[] {
  const startMidnight = getUTCMidnight(start);
  const endMidnight = getUTCMidnight(end);

  // 같은 날이면 하나의 chunk
  if (startMidnight.getTime() === endMidnight.getTime()) {
    return [{ startDate: start, durationMs: totalMs }];
  }

  const chunks: TimeChunk[] = [];

  // 첫날 chunk
  const firstDayEnd = getNextDayMidnight(startMidnight);
  chunks.push({
    startDate: start,
    durationMs: firstDayEnd.getTime() - start.getTime(),
  });

  // 중간 날들 (하루 전체)
  let current = new Date(firstDayEnd);
  while (current.getTime() < endMidnight.getTime()) {
    const nextDay = getNextDayMidnight(current);
    chunks.push({
      startDate: new Date(current),
      durationMs: nextDay.getTime() - current.getTime(),
    });
    current = nextDay;
  }

  // 마지막 날 chunk
  const lastDayMs = end.getTime() - endMidnight.getTime();
  if (lastDayMs > 0) {
    chunks.push({ startDate: endMidnight, durationMs: lastDayMs });
  }

  return chunks;
}

/** chunks를 비율에 따라 초 단위로 변환 */
function convertToSeconds(chunks: TimeChunk[], allowedSec: number): SplitTimeForStop[] {
  const totalMs = chunks.reduce((sum, chunk) => sum + chunk.durationMs, 0);
  const ratio = totalMs > 0 ? allowedSec / (totalMs / 1000) : 0;

  const result = chunks.map((chunk) => ({
    date: chunk.startDate.toISOString(),
    timeSpent: Math.max(0, Math.floor((chunk.durationMs / 1000) * ratio)),
  }));

  // 반올림 오차 보정
  const sum = result.reduce((acc, item) => acc + item.timeSpent, 0);
  if (sum < allowedSec && result.length > 0) {
    result[result.length - 1].timeSpent += allowedSec - sum;
  }

  return result;
}

export function buildSplitTimesForStop(
  startTime: string,
  endTime: Date,
  pausedDurationMs: number = 0
): SplitTimeForStop[] {
  const start = new Date(startTime);
  const totalMs = Math.max(0, endTime.getTime() - start.getTime() - pausedDurationMs);
  const allowedSec = Math.floor(totalMs / 1000);
  
  if (allowedSec <= 0) return [];

  const chunks = splitByDays(start, endTime, totalMs);
  return convertToSeconds(chunks, allowedSec);
}

export function applySafetyBuffer(
  splitTimes: SplitTimeForStop[],
  safeSec: number
): SplitTimeForStop[] {
  const adjusted = splitTimes.map((split) => ({ ...split }));
  let toDeduct = adjusted.reduce((acc, split) => acc + split.timeSpent, 0) - safeSec;

  for (let i = adjusted.length - 1; i >= 0 && toDeduct > 0; i--) {
    const reduction = Math.min(adjusted[i].timeSpent, toDeduct);
    adjusted[i].timeSpent -= reduction;
    toDeduct -= reduction;
  }

  return adjusted;
}
