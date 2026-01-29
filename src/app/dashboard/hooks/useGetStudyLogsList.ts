import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAccessToken } from "@/config/utils/tokenStorage";
import type {
  StudyLogsListApiResponse,
  StudyLogsListResult,
} from "../types";

/**
 * Swagger 기준:
 * - page 기본값: 1
 * - limit 기본값: 10
 */
const DEFAULT_PAGE_SIZE = 10;

/**
 * API 응답 모델(백엔드 DTO)을
 * 프론트에서 쓰기 좋은 결과 모델(도메인/뷰모델)로 변환한다.
 *
 * - studyLogs: 서버 필드명을 프론트 컨벤션으로 맵핑
 * - pagination: totalPages만 노출
 */
function mapToResult(apiResponse: StudyLogsListApiResponse): StudyLogsListResult {
  const { studyLogs, pagination } = apiResponse.data;

  return {
    content: studyLogs.map((apiStudyLog) => ({
      // id → studyLogId (프론트에서 의미 명확화)
      studyLogId: apiStudyLog.id,

      // date (YYYY-MM-DD 등 서버 포맷 그대로 사용)
      date: apiStudyLog.date,

      // todayGoal → goal (UI에서 더 자연스러운 이름)
      goal: apiStudyLog.todayGoal,

      // studyTime → studyTimeMinutes (단위 명시)
      studyTimeMinutes: apiStudyLog.studyTime,

      // totalTasks → todoCount (UI 용어에 맞춤)
      todoCount: apiStudyLog.totalTasks,

      // incompleteTasks → unfinishedCount
      unfinishedCount: apiStudyLog.incompleteTasks,

      // completionRate 그대로 유지
      completionRate: apiStudyLog.completionRate,
    })),
    totalPages: pagination.totalPages,
  };
}

/**
 * 스터디 로그 목록 조회 훅
 *
 * @param pageNumber - 조회할 페이지 (1부터 시작)
 * @param pageSize - 페이지 당 항목 수 (기본 10)
 * @param isEnabled - React Query 실행 여부 (기본 true)
 *
 * 동작:
 * - pageNumber가 1 미만이면 쿼리 비활성화
 * - queryKey에 page/pageSize를 포함하여 페이지별 캐싱
 * - staleTime 30초: 30초 동안은 "신선"으로 판단하여 불필요한 재요청 감소
 */
export function useGetStudyLogsList(
  pageNumber: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
  isEnabled: boolean = true
): UseQueryResult<StudyLogsListResult, Error> {
  return useQuery({
    // 페이지/사이즈가 달라지면 별도의 캐시로 관리됨
    queryKey: [QueryKey.STUDY_LOGS_LIST, pageNumber, pageSize],

    // enabled 조건: 외부 enabled + 페이지 최소값 방어
    enabled: isEnabled && pageNumber >= 1,

    // 실제 API 호출
    queryFn: async () => {
      const queryParams = {
        page: String(pageNumber),
        limit: String(pageSize),
      };

      // 인증 헤더 포함 (예: Authorization)
      const token = getAccessToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const apiResponse =
        await ApiClient.get<StudyLogsListApiResponse>(
          "/api/study-logs",
          queryParams,
          headers
        );

      // API DTO → 프론트 결과 모델 변환
      return mapToResult(apiResponse);
    },

    // 30초 동안은 fresh로 간주
    staleTime: 30 * 1000,
  });
}
