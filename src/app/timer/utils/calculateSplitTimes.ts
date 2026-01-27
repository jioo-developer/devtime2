/**
 * startTime부터 현재까지의 시간을 날짜별로 분할
 * 자정을 기준으로 날짜가 바뀌면 분리
 */
export type SplitTime = {
  date: string; // ISO date string (예: "2026-01-26T15:25:11.412Z") ← 실제로는 자정 ISO를 넣음
  timeSpent: number; // 밀리초
};

export function calculateSplitTimes(
  startTime: string,
  endTime: Date = new Date(),
  pausedDuration: number = 0 // 밀리초
): SplitTime[] {
  // 1) 입력을 Date로 파싱
  const start = new Date(startTime);
  const end = new Date(endTime);

  // 2) 결과 배열
  const splitTimes: SplitTime[] = [];

  // 3) 실제 공부 시간 = (종료 - 시작) - (일시정지)
  const totalTimeSpent = end.getTime() - start.getTime() - pausedDuration;

  // 4) 공부 시간이 0 이하이면 의미 없으니 빈 배열
  if (totalTimeSpent <= 0) return [];

  // 5) 시작일의 자정(00:00:00.000) 만들기
  const startMidnight = new Date(start);
  startMidnight.setHours(0, 0, 0, 0);

  // 6) 종료일의 자정 만들기
  const endMidnight = new Date(end);
  endMidnight.setHours(0, 0, 0, 0);

  // 7) 시작과 종료가 "같은 날짜"라면 (자정 기준 동일)
  if (startMidnight.getTime() === endMidnight.getTime()) {
    // 해당 날짜에 totalTimeSpent 전부를 넣고 끝
    splitTimes.push({
      date: formatDate(startMidnight), // 자정 ISO
      timeSpent: Math.max(0, totalTimeSpent),
    });
    return splitTimes;
  }

  // -------------------------
  // 날짜가 여러 날에 걸친 경우
  // -------------------------

  // 8) 첫 날: startTime ~ 다음날 자정
  const firstDayEnd = new Date(startMidnight);
  firstDayEnd.setDate(firstDayEnd.getDate() + 1); // 다음 날 자정
  const firstDayTime = firstDayEnd.getTime() - start.getTime();
  // 첫날 running time(일시정지 차감 전)

  // 9) 중간 날들: "완전한 하루"들(자정~자정)을 수집
  const currentDay = new Date(startMidnight);
  currentDay.setDate(currentDay.getDate() + 1); // 시작 다음날 자정부터 시작

  const middleDays: { date: Date; timeSpent: number }[] = [];

  while (currentDay.getTime() < endMidnight.getTime()) {
    const dayEnd = new Date(currentDay);
    dayEnd.setDate(dayEnd.getDate() + 1); // 다음날 자정

    const dayTime = dayEnd.getTime() - currentDay.getTime();

    middleDays.push({
      date: new Date(currentDay), // 해당 날짜의 자정
      timeSpent: dayTime, // 24시간
    });

    // 다음 날짜로 이동
    currentDay.setDate(currentDay.getDate() + 1);
  }

  // 10) 마지막 날: 종료일 자정 ~ endTime
  const lastDayTime = end.getTime() - endMidnight.getTime();

  // 11) "일시정지 차감 전" 총 시간(첫날 + 중간날들 + 마지막날)
  const totalRawTime =
    firstDayTime +
    middleDays.reduce((sum, day) => sum + day.timeSpent, 0) +
    lastDayTime;

  // 12) 일시정지를 날짜별로 정확히 분배할 수 없으니
  //     전체 running time 대비 실제 공부시간(totalTimeSpent) 비율을 구해서
  //     각 날짜 running time에 곱하는 방식으로 "비례 차감"
  const adjustmentRatio = totalRawTime > 0 ? totalTimeSpent / totalRawTime : 0;

  // 13) 첫 날 조정값 = floor(첫날 running time * 비율)
  const adjustedFirstDayTime = Math.max(0, Math.floor(firstDayTime * adjustmentRatio));
  splitTimes.push({
    date: formatDate(startMidnight),
    timeSpent: adjustedFirstDayTime,
  });

  // 14) 지금까지 누적된 조정 합
  let totalAdjusted = adjustedFirstDayTime;

  // 15) 중간 날들도 동일하게 비율 곱하고 floor
  middleDays.forEach((day) => {
    const adjustedTime = Math.max(0, Math.floor(day.timeSpent * adjustmentRatio));
    splitTimes.push({
      date: formatDate(day.date),
      timeSpent: adjustedTime,
    });
    totalAdjusted += adjustedTime;
  });

  // 16) 마지막 날: 남은 시간을 "전부 몰아서" 넣어 총합을 정확히 맞춤
  if (lastDayTime > 0) {
    const remainingTime = totalTimeSpent - totalAdjusted;
    splitTimes.push({
      date: formatDate(endMidnight),
      timeSpent: Math.max(0, remainingTime),
    });
  } else {
    if (splitTimes.length > 0) {
      splitTimes[0].timeSpent += totalTimeSpent - totalAdjusted;
    }
  }

  // 18) 날짜별 분할 결과 반환
  return splitTimes;
}

function formatDate(date: Date): string {
  // 19) 입력 date를 자정으로 고정하고 ISO로 반환
  const isoDate = new Date(date);
  isoDate.setHours(0, 0, 0, 0);
  return isoDate.toISOString();
}

/**
 * startTime부터 현재까지의 splitTimes를 계산
 */
export function getCurrentSplitTimes(startTime?: string, pausedDuration: number = 0): SplitTime[] {
  // 20) startTime 없으면 빈 배열
  if (!startTime) return [];
  // 21) endTime은 "현재"로 넣어서 계산
  return calculateSplitTimes(startTime, new Date(), pausedDuration);
}
