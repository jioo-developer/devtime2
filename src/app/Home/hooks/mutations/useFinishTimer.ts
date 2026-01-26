import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { SplitTime } from "../../utils/calculateSplitTimes";

type FinishTimerRequest = {
  splitTimes: SplitTime[];
  tasks: string[];
  reflection: string;
};

type FinishTimerResponse = {
  message: string;
};

export const useFinishTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    FinishTimerResponse,
    Error,
    { timerId: string; data: FinishTimerRequest }
  >({
    mutationFn: async ({ timerId, data }) => {
      return await ApiClient.post<FinishTimerResponse>(
        `/api/timers/${timerId}/stop`,
        data,
        getAuthHeaders()
      );
    },
    onSuccess: () => {
      // 타이머 상태 갱신
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
  });
};
