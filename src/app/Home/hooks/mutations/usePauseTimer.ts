import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { SplitTime } from "../../utils/calculateSplitTimes";

type PauseTimerRequest = {
  splitTimes: SplitTime[];
};

type PauseTimerResponse = {
  message: string;
};

export const usePauseTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<PauseTimerResponse, Error, { timerId: string; data: PauseTimerRequest }>({
    mutationFn: async ({ timerId, data }) => {
      return await ApiClient.put<PauseTimerResponse>(
        `/api/timers/${timerId}`,
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
