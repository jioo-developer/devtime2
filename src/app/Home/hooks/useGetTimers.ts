import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

export type TimerResponse = {
  message: string;
  studyLogId: string;
  timerId: string;
  startTime: string; // ISO date string
};

const defaultTimerResponse: TimerResponse = {
  message: "",
  studyLogId: "",
  timerId: "",
  startTime: "",
};

export const useGetTimers = (): UseQueryResult<TimerResponse, Error> => {
  return useQuery<TimerResponse, Error>({
    queryKey: [QueryKey.TIMERS],
    queryFn: async () => {
      return await ApiClient.get<TimerResponse>(
        "/api/timers",
        undefined,
        getAuthHeaders()
      );
    },
    retry: 3,
    staleTime: 0, // 항상 최신 데이터를 가져오도록
    refetchOnMount: true, // 마운트 시 항상 재요청
    refetchOnWindowFocus: true, // 윈도우 포커스 시 재요청
  });
};
