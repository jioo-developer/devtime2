import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { parseErrorDetail } from "@/utils/parseErrorDetail";

/** POST /api/timers/:timerId/stop 요청 body (스펙 기준) */
export type FinishTimerTaskItem = {
  content: string;
  isCompleted: boolean;
};

/** splitTimes[].date = 구간 시작 시각 ISO, timeSpent = 초(정수). 합계는 floor((end-start-paused)/1000)에 맞춤 */
export type FinishTimerSplitItem = {
  date: string; // 구간 시작 시각 ISO (예: startTime 또는 자정 경계 시각)
  timeSpent: number; // seconds (정수)
};

export type FinishTimerRequest = {
  splitTimes: FinishTimerSplitItem[];
  tasks: FinishTimerTaskItem[];
  review: string;
};

type FinishTimerVariables = {
  timerId: string;
  data: FinishTimerRequest;
};

/** POST /api/timers/:timerId/stop 응답 */
export type FinishTimerResponse = {
  message: string;
  totalTime?: number;
  endTime?: string;
};

export const useFinishTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<FinishTimerResponse, Error, FinishTimerVariables>({
    mutationFn: async ({ timerId, data }) => {
      const res = await ApiClient.post<FinishTimerResponse>(
        `/api/timers/${timerId}/stop`,
        data,
        getAuthHeaders(),
        {
          onNotOk: async (response) => {
            const err = await parseErrorDetail(response);
            throw new Error(
              `POST /api/timers/${timerId}/stop failed (${err.status}): ${err.message}`
            );
          },
        }
      );
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
  });
};
