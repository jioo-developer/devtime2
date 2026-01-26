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
  return useQuery({
    queryKey: [QueryKey.TIMERS],

    queryFn: async () => {
      try {
        return await ApiClient.get<TimerResponse>(
          "/api/timers",
          undefined,
          getAuthHeaders()
        );
      } catch (error) {
        console.error("타이머 데이터를 가져오는데 실패했습니다:", error);
        throw error;
      }
    },
    retry: false,
    initialData: defaultTimerResponse,
  });
};
