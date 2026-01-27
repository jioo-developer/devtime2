import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { SplitTime } from "@/app/timer/utils/calculateSplitTimes";
import { ResponseMessage, TimerIdWithData } from "./type";

interface ResumeTimerVariables extends TimerIdWithData {
  splitTimes: SplitTime[];
};

export const useResumeTimer = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseMessage, Error, ResumeTimerVariables>({
    mutationFn: async ({ timerId, splitTimes }) => {
      return await ApiClient.put<ResponseMessage>(
        `/api/timers/${timerId}`,
        splitTimes,
        getAuthHeaders()
      );
    },
    onSuccess: () => {
      // 타이머 상태 갱신
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
  });
};
