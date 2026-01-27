import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { SplitTime } from "../../utils/calculateSplitTimes";
import { ResponseMessage, TimerIdWithData } from "./type";
interface PauseTimerVariables extends TimerIdWithData {
  data: SplitTime[];
};

export const usePauseTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseMessage, Error, PauseTimerVariables>({
    mutationFn: async ({ timerId, data }) => {
      return await ApiClient.put<ResponseMessage>(
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
