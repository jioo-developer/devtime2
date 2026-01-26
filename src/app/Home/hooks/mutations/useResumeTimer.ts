import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { SplitTime } from "../../utils/calculateSplitTimes";

type ResumeTimerRequest = {
  splitTimes: SplitTime[];
};

type ResumeTimerResponse = {
  message: string;
};

export const useResumeTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<ResumeTimerResponse, Error, { timerId: string; data: ResumeTimerRequest }>({
    mutationFn: async ({ timerId, data }) => {
      return await ApiClient.put<ResumeTimerResponse>(
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
