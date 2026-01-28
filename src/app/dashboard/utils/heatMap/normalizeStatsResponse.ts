import type { StatsResponse } from "../../types";
import { formatMinToHm, formatConsecDays, formatTaskRate } from "../formatStats";
import { MAX_HOURS } from "../data";

/** KpiSection 표시용으로 가공된 통계 */
export type StatsDisplay = {
  totalTime: string;
  totalDays: string;
  dailyAvg: string;
  goalRate: string;
  weekdayHours: [number, number, number, number, number, number, number];
};

/** API weekdayStudyTime 객체 → [Sun, Mon, Tue, Wed, Thu, Fri, Sat] 순서. 값은 시간 단위 가정. */
const WEEKDAY_ORDER: (keyof StatsResponse["weekdayStudyTime"])[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function toStatsDisplay(statsResponse: StatsResponse): StatsDisplay {
  const weekdayStudyTime = statsResponse.weekdayStudyTime;
  const weekdayHours = WEEKDAY_ORDER.map(
    (weekdayKey) => Math.min(MAX_HOURS, Math.max(0, weekdayStudyTime[weekdayKey] ?? 0)),
  ) as StatsDisplay["weekdayHours"];

  return {
    totalTime: formatMinToHm(statsResponse.totalStudyTime),
    totalDays: formatConsecDays(statsResponse.consecutiveDays),
    dailyAvg: formatMinToHm(statsResponse.averageDailyStudyTime),
    goalRate: formatTaskRate(statsResponse.taskCompletionRate),
    weekdayHours,
  };
}
