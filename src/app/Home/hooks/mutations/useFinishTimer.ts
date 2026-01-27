import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { parseErrorDetail } from "@/utils/parseErrorDetail";

export type FinishTimerTaskItem = {
  content: string;
  isCompleted: boolean;
};

export type FinishTimerSplitItem = {
  date: string;
  timeSpent: number;
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
