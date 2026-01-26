/**
 * startTime부터 현재까지의 시간을 날짜별로 분할
 * 자정을 기준으로 날짜가 바뀌면 분리
 */
export type SplitTime = {
  date: string; // "YYYY-MM-DD"
  timeSpent: number; // 밀리초
};

export function calculateSplitTimes(
  startTime: string,
  endTime: Date = new Date()
): SplitTime[] {
  const start = new Date(startTime);
  const splitTimes: SplitTime[] = [];

  // 시작일의 자정
  const startMidnight = new Date(start);
  startMidnight.setHours(0, 0, 0, 0);

  // 종료일의 자정
  const endMidnight = new Date(endTime);
  endMidnight.setHours(0, 0, 0, 0);

  // 같은 날이면
  if (startMidnight.getTime() === endMidnight.getTime()) {
    const timeSpent = endTime.getTime() - start.getTime();
    splitTimes.push({
      date: formatDate(startMidnight),
      timeSpent,
    });
    return splitTimes;
  }

  // 첫 날 (시작 시간부터 자정까지)
  const firstDayEnd = new Date(startMidnight);
  firstDayEnd.setDate(firstDayEnd.getDate() + 1); // 다음 날 자정
  const firstDayTime = firstDayEnd.getTime() - start.getTime();
  splitTimes.push({
    date: formatDate(startMidnight),
    timeSpent: firstDayTime,
  });

  // 중간 날들 (전체 날짜)
  const currentDay = new Date(startMidnight);
  currentDay.setDate(currentDay.getDate() + 1);

  while (currentDay.getTime() < endMidnight.getTime()) {
    const dayEnd = new Date(currentDay);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dayTime = dayEnd.getTime() - currentDay.getTime(); // 24시간 = 86400000ms
    splitTimes.push({
      date: formatDate(currentDay),
      timeSpent: dayTime,
    });
    currentDay.setDate(currentDay.getDate() + 1);
  }

  // 마지막 날 (자정부터 종료 시간까지)
  const lastDayTime = endTime.getTime() - endMidnight.getTime();
  splitTimes.push({
    date: formatDate(endMidnight),
    timeSpent: lastDayTime,
  });

  return splitTimes;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
