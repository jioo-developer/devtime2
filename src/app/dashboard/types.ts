/**
 * 대시보드 API 응답 타입 (스웨거 스펙 기준)
 */

/** GET /api/stats — 나의 공부 기록 통계 */
export type StatsResponse = {
  consecutiveDays: number;
  totalStudyTime: number;
  averageDailyStudyTime: number;
  taskCompletionRate: number;
  weekdayStudyTime: {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
  };
};

/** GET /api/heatmap — 공부 시간 바다 일자별 항목 */
export type HeatmapItemDto = {
  date: string;
  studyTimeHours: number;
  colorLevel: number;
};

export type HeatmapResponse = {
  heatmap: HeatmapItemDto[];
};

/** GET /api/study-logs — API 응답 (원본) */
export type StudyLogsListApiResponse = {
  success: boolean;
  data: {
    studyLogs: {
      id: string;
      date: string;
      todayGoal: string;
      studyTime: number;
      totalTasks: number;
      incompleteTasks: number;
      completionRate: number;
    }[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
};

/** 학습 기록 목록 · 테이블 표시용 (API → 내부 매핑) */
export type StudyLogListItem = {
  studyLogId: string;
  date: string;
  goal: string;
  studyTimeMinutes: number;
  todoCount: number;
  unfinishedCount: number;
  completionRate: number;
};

/** useGetStudyLogsList 반환용 (목록 + 페이지네이션) */
export type StudyLogsListResult = {
  content: StudyLogListItem[];
  totalPages: number;
};
