import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

export type TimerResponse = {
  message: string;
  studyLogId: string;
  timerId: string;
  startTime: string;
};

const defaultTimerResponse: TimerResponse = {
  message: "",
  studyLogId: "",
  timerId: "",
  startTime: "",
};

export const useGetTimers = (
  enabled: boolean = true
): UseQueryResult<TimerResponse, Error> => {
  return useQuery<TimerResponse, Error>({
    queryKey: [QueryKey.TIMERS],
    enabled,
    queryFn: async () =>
      ApiClient.get<TimerResponse>(
        "/api/timers",
        undefined,
        getAuthHeaders(),
        {
          onNotOk: async (response) => {
            if (response.status === 404) return defaultTimerResponse;
            throw new Error("GET /api/timers failed");
          },
        }
      ),
    retry: 3,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    initialData: defaultTimerResponse,
  });
};