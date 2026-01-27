import { getUTCMidnight, toUTCMidnightISO, getNextDayMidnight } from "./dateUtils";

export type SplitTime = {
  date: string;
  timeSpent: number;
};

type DaySegment = {
  date: Date;
  timeSpent: number;
};

/** 시작~종료를 날짜별 segment로 분할 */
function splitIntoDaySegments(
  start: Date,
  end: Date,
  totalTimeSpent: number
): DaySegment[] {
  const startMidnight = getUTCMidnight(start);
  const endMidnight = getUTCMidnight(end);

  // 같은 날
  if (startMidnight.getTime() === endMidnight.getTime()) {
    return [{ date: start, timeSpent: totalTimeSpent }];
  }

  const segments: DaySegment[] = [];

  // 첫날
  const firstDayEnd = getNextDayMidnight(startMidnight);
  const firstDayTime = firstDayEnd.getTime() - start.getTime();
  segments.push({ date: start, timeSpent: firstDayTime });

  // 중간 날들
  let current = new Date(firstDayEnd);
  while (current.getTime() < endMidnight.getTime()) {
    const nextDay = getNextDayMidnight(current);
    segments.push({
      date: new Date(current),
      timeSpent: nextDay.getTime() - current.getTime(),
    });
    current = nextDay;
  }

  // 마지막 날
  const lastDayTime = end.getTime() - endMidnight.getTime();
  if (lastDayTime > 0) {
    segments.push({ date: end, timeSpent: lastDayTime });
  }

  return segments;
}

/** segment들을 실제 시간에 맞춰 조정 */
function adjustSegments(
  segments: DaySegment[],
  totalTimeSpent: number
): SplitTime[] {
  const totalRawTime = segments.reduce((sum, seg) => sum + seg.timeSpent, 0);
  const ratio = totalRawTime > 0 ? totalTimeSpent / totalRawTime : 0;

  const result: SplitTime[] = [];
  let accumulated = 0;

  segments.forEach((seg) => {
    const adjusted = Math.max(0, Math.floor(seg.timeSpent * ratio));
    result.push({ date: toUTCMidnightISO(seg.date), timeSpent: adjusted });
    accumulated += adjusted;
  });

  // 마지막에 남은 차이 보정
  if (result.length > 0) {
    const lastIndex = segments[segments.length - 1].timeSpent > 0 ? result.length - 1 : 0;
    result[lastIndex].timeSpent += totalTimeSpent - accumulated;
  }

  return result;
}

export function calculateSplitTimes(
  startTime: string,
  endTime: Date = new Date(),
  pausedDuration: number = 0
): SplitTime[] {
  const start = new Date(startTime);
  const totalTimeSpent = endTime.getTime() - start.getTime() - pausedDuration;

  if (totalTimeSpent <= 0) return [];

  const segments = splitIntoDaySegments(start, endTime, totalTimeSpent);
  return adjustSegments(segments, totalTimeSpent);
}

export function getCurrentSplitTimes(
  startTime?: string,
  pausedDuration: number = 0
): SplitTime[] {
  if (!startTime) return [];
  return calculateSplitTimes(startTime, new Date(), pausedDuration);
}
