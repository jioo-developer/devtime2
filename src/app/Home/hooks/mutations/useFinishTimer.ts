import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { SplitTime } from "../../utils/calculateSplitTimes";
import { ResponseMessage, TimerIdWithData } from "./type";

type FinishTimerRequest = {
  splitTimes: SplitTime[];
  tasks: string[];
  reflection: string;
};

interface FinishTimerVariables extends TimerIdWithData {
  data: FinishTimerRequest;
};

export const useFinishTimer = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ResponseMessage,
    Error,
    FinishTimerVariables
  >({
    mutationFn: async ({ timerId, data }) => {
      return await ApiClient.post<ResponseMessage>(
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
