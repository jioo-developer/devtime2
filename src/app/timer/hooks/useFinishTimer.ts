import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

/** POST /api/timers/:timerId/stop 요청 body (스펙 기준) */
export type FinishTimerTaskItem = {
  content: string;
  isCompleted: boolean;
};

/** splitTimes[].timeSpent 는 초(seconds) 단위 */
export type FinishTimerSplitItem = {
  date: string; // ISO date string
  timeSpent: number; // seconds
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
      return await ApiClient.post<FinishTimerResponse>(
        `/api/timers/${timerId}/stop`,
        data,
        getAuthHeaders(),
        {
          onNotOk: async (response) => {
            const text = await response.text();
            let detail = "";
            try {
              const json = JSON.parse(text) as { error?: { message?: string } };
              detail = json.error?.message ?? text;
            } catch {
              detail = text || response.statusText;
            }
            throw new Error(
              `POST /api/timers/${timerId}/stop failed (${response.status}): ${detail}`
            );
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
  });
};
