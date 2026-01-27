import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import type { SplitTime } from "@/app/timer/utils/calculateSplitTimes";

export type FinishTimerTaskItem = {
  content: string;
  isCompleted: boolean;
};

type FinishTimerRequest = {
  splitTimes: SplitTime[];
  tasks: FinishTimerTaskItem[];
  review: string;
};

type FinishTimerVariables = {
  timerId: string;
  data: FinishTimerRequest;
};

type ResponseMessage = { message: string };

export const useFinishTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseMessage, Error, FinishTimerVariables>({
    mutationFn: async ({ timerId, data }) => {
      return await ApiClient.post<ResponseMessage>(
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
