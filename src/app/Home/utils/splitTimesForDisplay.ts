import {
  getUTCMidnight,        // 전달된 Date를 UTC 기준 자정(Date 객체)으로 변환
  toUTCMidnightISO,     // Date를 UTC 자정 ISO 문자열로 변환
  getNextDayMidnight    // 전달된 자정 기준으로 다음 날 자정(Date 객체) 반환
} from "./dateUtils";

/**
 * 외부로 반환되는 날짜별 분할 시간 타입
 */
export type SplitTime = {
  date: string;        // UTC 자정 기준 날짜 ISO 문자열
  timeSpent: number;  // 해당 날짜에 소비된 시간(ms)
};

/**
 * 내부 계산용 segment 타입
 */
type DaySegment = {
  date: Date;         // segment 기준 날짜
  timeSpent: number; // 원본 기준으로 계산된 시간(ms)
};

/**
 * 시작~종료 시간을 날짜 단위로 분할하여 segment 배열 생성
 */
function splitIntoDaySegments(
  start: Date,              // 시작 시각
  end: Date,                // 종료 시각
  totalTimeSpent: number   // 전체 사용 시간(ms)
): DaySegment[] {

  // 시작 시각의 UTC 자정
  const startMidnight = getUTCMidnight(start);

  // 종료 시각의 UTC 자정
  const endMidnight = getUTCMidnight(end);

  // 시작과 종료가 같은 날짜인 경우 분할 없이 그대로 반환
  if (startMidnight.getTime() === endMidnight.getTime()) {
    return [
      {
        date: start,
        timeSpent: totalTimeSpent
      }
    ];
  }

  // 날짜별 segment를 저장할 배열
  const segments: DaySegment[] = [];

  /* 첫 번째 날 처리 */

  // 시작 날짜 기준 다음 날 자정
  const firstDayEnd = getNextDayMidnight(startMidnight);

  // 시작 시각부터 다음 날 자정까지의 시간
  const firstDayTime = firstDayEnd.getTime() - start.getTime();

  // 첫날 segment 추가
  segments.push({
    date: start,
    timeSpent: firstDayTime
  });

  /* 중간 날짜들 처리 */

  // 첫날 다음 자정부터 시작
  let current = new Date(firstDayEnd);

  // 종료 날짜 자정 전까지 반복
  while (current.getTime() < endMidnight.getTime()) {

    // 현재 날짜 기준 다음 날 자정
    const nextDay = getNextDayMidnight(current);

    // 하루 전체 시간 segment 추가
    segments.push({
      date: new Date(current),
      timeSpent: nextDay.getTime() - current.getTime()
    });

    // 다음 날짜로 이동
    current = nextDay;
  }

  /* 마지막 날 처리 */

  // 마지막 날짜 자정부터 종료 시각까지의 시간
  const lastDayTime = end.getTime() - endMidnight.getTime();

  // 실제 사용 시간이 있으면 추가
  if (lastDayTime > 0) {
    segments.push({
      date: end,
      timeSpent: lastDayTime
    });
  }

  // 날짜별 원본 segment 반환
  return segments;
}

/**
 * segment 시간들을 실제 totalTimeSpent에 맞게 비율 보정
 */
function adjustSegments(
  segments: DaySegment[],
  totalTimeSpent: number
): SplitTime[] {

  // 원본 segment 시간 총합
  const totalRawTime = segments.reduce(
    (sum, segment) => sum + segment.timeSpent,
    0
  );

  // 비율 계산 (오차 보정을 위한 스케일링)
  const ratio = totalRawTime > 0
    ? totalTimeSpent / totalRawTime
    : 0;

  const result: SplitTime[] = [];
  let accumulated = 0; // 조정된 시간 누적값

  // 각 segment를 비율에 맞게 조정
  segments.forEach((segment) => {

    // 비율 적용 후 소수점 버림
    const adjusted = Math.max(
      0,
      Math.floor(segment.timeSpent * ratio)
    );

    result.push({
      date: toUTCMidnightISO(segment.date), // 날짜를 UTC 자정 ISO 문자열로 변환
      timeSpent: adjusted
    });

    accumulated += adjusted;
  });

  // 전체 합계와의 오차를 마지막 segment에 보정
  if (result.length > 0) {

    // 마지막 segment가 유효하면 마지막에, 아니면 첫 번째에 보정
    const lastIndex =
      segments[segments.length - 1].timeSpent > 0
        ? result.length - 1
        : 0;

    result[lastIndex].timeSpent += totalTimeSpent - accumulated;
  }

  return result;
}

/**
 * 시작 시간부터 종료 시간까지를 날짜별로 분할 계산
 */
export function calculateSplitTimes(
  startTime: string,        // 시작 시각 ISO 문자열
  endTime: Date = new Date(), // 종료 시각 (기본값: 현재)
  pausedDuration: number = 0 // 일시정지 누적 시간(ms)
): SplitTime[] {

  // 시작 시간 Date 변환
  const start = new Date(startTime);

  // 실제 사용 시간 = 종료 - 시작 - 일시정지
  const totalTimeSpent =
    endTime.getTime() -
    start.getTime() -
    pausedDuration;

  // 유효하지 않으면 빈 배열 반환
  if (totalTimeSpent <= 0) return [];

  // 날짜별 원본 segment 생성
  const segments = splitIntoDaySegments(
    start,
    endTime,
    totalTimeSpent
  );

  // 비율 조정 후 최종 결과 반환
  return adjustSegments(segments, totalTimeSpent);
}

/**
 * 현재 시각 기준으로 split 계산 (편의 함수)
 */
export function getCurrentSplitTimes(
  startTime?: string,
  pausedDuration: number = 0
): SplitTime[] {

  // 시작 시간이 없으면 빈 배열
  if (!startTime) return [];

  // 현재 시간 기준으로 계산
  return calculateSplitTimes(
    startTime,
    new Date(),
    pausedDuration
  );
}
