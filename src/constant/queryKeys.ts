export enum QueryKey {
  PROFILE = "devtime/profile",
  TIMERS = "devtime/timers",
  STUDY_LOGS = "devtime/study-logs",
  /** GET /api/stats — 나의 공부 기록 통계 */
  STATS = "devtime/stats",
  /** GET /api/heatmap — 공부 시간 바다 */
  HEATMAP = "devtime/heatmap",
  /** GET /api/study-logs — 학습 기록 목록(페이지네이션) */
  STUDY_LOGS_LIST = "devtime/study-logs-list",
}
