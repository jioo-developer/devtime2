/**
 * 대시보드 UI 상수 · 라벨 (데이터는 API 훅에서 조회)
 */

export const MAX_HOURS = 24;

/** KpiSection 표시용 키 (StatsDisplay와 동일) */
export type DashboardKpi = {
  totalTime: string;
  totalDays: string;
  dailyAvg: string;
  goalRate: string;
};

export const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"] as const;
export const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export const MONTH_LABELS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
export const HEATMAP_LEGEND_LEVELS = [0, 1, 2, 3, 4, 5] as const;
export const HEATMAP_Y_LABELS = ["24시간", "16시간", "8시간"] as const;

/** KPI 카드 라벨–값 매핑 */
export const KPI_ITEMS: { label: string; value: keyof DashboardKpi }[] = [
  { label: "누적 공부 시간", value: "totalTime" },
  { label: "누적 공부 일수", value: "totalDays" },
  { label: "하루 평균 공부 시간", value: "dailyAvg" },
  { label: "목표 달성률", value: "goalRate" },
];

/** 히트맵 요일 축 라벨 (한글) */
export const HEATMAP_WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 히트맵 범례 레벨별 배경색 */
export const HEATMAP_LEGEND_BG: Record<number, string> = {
  0: "var(--gray-100)",
  1: "#bfdbfe",
  2: "#93c5fd",
  3: "#60a5fa",
  4: "var(--primary-core)",
  5: "var(--secondary-indigo)",
};
