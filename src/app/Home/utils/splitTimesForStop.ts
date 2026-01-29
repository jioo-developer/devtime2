import { getUTCMidnight, getNextDayMidnight } from "./dateUtils";
// getUTCMidnight: 전달된 Date를 UTC 기준 자정(Date)으로 정규화
// getNextDayMidnight: 전달된 UTC 자정(Date) 기준 다음 날 자정(Date) 반환

/**
 * stop 시점에 서버로 보낼(혹은 저장할) 날짜별 분할 시간(초 단위) 타입
 */
export type SplitTimeForStop = {
  date: string;      // 날짜 키(여기서는 ISO 문자열)
  timeSpent: number; // 해당 날짜에 배분된 시간(초)
};

/**
 * 내부 계산용: "하루 단위"로 잘린 시간 조각
 */
type TimeChunk = {
  startDate: Date;    // chunk가 시작되는 날짜 기준(주로 UTC 자정 또는 첫날 시작 시각)
  durationMs: number; // 해당 chunk의 지속 시간(ms)
};

/**
 * 시작~종료 구간을 "UTC 날짜" 기준으로 하루 단위 chunk로 분할
 */
function splitByDays(start: Date, end: Date, totalMs: number): TimeChunk[] {
  // 시작 시각의 UTC 자정
  const startMidnight = getUTCMidnight(start);

  // 종료 시각의 UTC 자정
  const endMidnight = getUTCMidnight(end);

  // 시작과 종료가 같은 UTC 날짜면 분할 없이 하나의 chunk로 처리
  if (startMidnight.getTime() === endMidnight.getTime()) {
    return [{ startDate: start, durationMs: totalMs }];
  }

  // 분할 결과를 담을 배열
  const chunks: TimeChunk[] = [];

  /* 첫날 chunk */

  // 시작 날짜의 다음 날 UTC 자정
  const firstDayEnd = getNextDayMidnight(startMidnight);

  // 시작 시각부터 다음 날 자정까지를 첫날 chunk로 추가
  chunks.push({
    startDate: start,
    durationMs: firstDayEnd.getTime() - start.getTime(),
  });

  /* 중간 날짜들 chunk (각각 하루 전체) */

  // 첫날 다음 자정부터 시작
  let current = new Date(firstDayEnd);

  // 종료 날짜 자정 전까지 "하루 단위"로 chunk를 누적
  while (current.getTime() < endMidnight.getTime()) {
    // current(UTC 자정) 기준 다음 날 UTC 자정
    const nextDay = getNextDayMidnight(current);

    // 하루(24h) 전체를 chunk로 추가
    chunks.push({
      startDate: new Date(current),
      durationMs: nextDay.getTime() - current.getTime(),
    });

    // 다음 날로 이동
    current = nextDay;
  }

  /* 마지막 날 chunk */

  // 종료 날짜 자정부터 종료 시각까지의 시간
  const lastDayMs = end.getTime() - endMidnight.getTime();

  // 마지막 날에 실제 시간이 있으면 마지막 chunk로 추가
  if (lastDayMs > 0) {
    chunks.push({ startDate: endMidnight, durationMs: lastDayMs });
    // 주의: 여기서는 startDate를 "endMidnight(UTC 자정)"로 둬서
    // 해당 날짜의 키가 자정 기준으로 정규화되도록 만든 형태
  }

  return chunks;
}

/**
 * chunk(ms)을 "초 단위"로 변환하되, allowedSec(총 허용 초)에 정확히 맞추도록 비율 보정
 */
function convertToSeconds(
  chunks: TimeChunk[],
  allowedSec: number
): SplitTimeForStop[] {
  // chunk의 ms 합계(원본 분할 합)
  const totalMs = chunks.reduce((sum, chunk) => sum + chunk.durationMs, 0);

  // ratio:
  // (각 chunk의 초) * ratio 를 한 뒤 floor로 내리면 전체 합이 allowedSec에 근접하도록 조정됨
  // totalMs/1000 = 원본 총 초
  const ratio = totalMs > 0 ? allowedSec / (totalMs / 1000) : 0;

  // 각 chunk를 date(ISO) + timeSpent(초)로 변환
  const result = chunks.map((chunk) => ({
    date: chunk.startDate.toISOString(), // 날짜 키를 ISO로 사용
    timeSpent: Math.max(
      0,
      Math.floor((chunk.durationMs / 1000) * ratio) // 비율 적용 후 소수점 버림
    ),
  }));

  // floor 때문에 생기는 누적 오차(합이 allowedSec보다 작아지는 문제) 보정
  const sum = result.reduce((acc, item) => acc + item.timeSpent, 0);

  // 합이 allowedSec보다 작으면 마지막 요소에 부족분을 더해 총합을 맞춤
  if (sum < allowedSec && result.length > 0) {
    result[result.length - 1].timeSpent += allowedSec - sum;
  }

  return result;
}

/**
 * stop 시점에 사용할 splitTimes 생성:
 * - startTime ~ endTime 구간에서 pausedDurationMs를 제외한 실제 사용 시간을 계산
 * - 날짜별 chunk로 분할
 * - 초 단위로 변환 및 합계 보정
 */
export function buildSplitTimesForStop(
  startTime: string,         // 시작 시각 ISO 문자열
  endTime: Date,             // 종료 시각 Date
  pausedDurationMs: number = 0 // 일시정지 누적 시간(ms)
): SplitTimeForStop[] {
  // startTime을 Date로 파싱
  const start = new Date(startTime);

  // 실제 사용 ms = (종료 - 시작 - 일시정지), 음수 방지
  const totalMs = Math.max(
    0,
    endTime.getTime() - start.getTime() - pausedDurationMs
  );

  // 서버에 보내는 단위를 초로 맞추기 위해 총 초(버림) 계산
  const allowedSec = Math.floor(totalMs / 1000);

  // 1초 미만이면 의미 있는 기록이 없으니 빈 배열
  if (allowedSec <= 0) return [];

  // 날짜별로 ms chunk 분할
  const chunks = splitByDays(start, endTime, totalMs);

  // chunk를 초로 변환 및 합계(allowedSec) 맞춤
  return convertToSeconds(chunks, allowedSec);
}

/**
 * 전체 splitTimes 합계를 safeSec로 제한하기 위한 "안전 버퍼" 적용 함수
 * - 현재 합계가 safeSec보다 크면 초과분을 뒤 날짜부터 깎아내림
 */
export function applySafetyBuffer(
  splitTimes: SplitTimeForStop[],
  safeSec: number
): SplitTimeForStop[] {
  // 원본을 직접 변형하지 않기 위해 얕은 복사본 생성
  const adjusted = splitTimes.map((split) => ({ ...split }));

  // 현재 총합 - 목표(safeSec) = 줄여야 하는 초 수
  let toDeduct =
    adjusted.reduce((acc, split) => acc + split.timeSpent, 0) - safeSec;

  // 뒤에서부터 줄임(최근 날짜를 우선적으로 감소)
  for (let i = adjusted.length - 1; i >= 0 && toDeduct > 0; i--) {
    // 해당 항목에서 줄일 수 있는 최대치와 남은 차감량 중 작은 값만큼 감소
    const reduction = Math.min(adjusted[i].timeSpent, toDeduct);

    // 차감 적용
    adjusted[i].timeSpent -= reduction;

    // 남은 차감량 업데이트
    toDeduct -= reduction;
  }

  return adjusted;
}
