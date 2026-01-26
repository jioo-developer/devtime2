import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

type PauseTimerResponse = {
  message: string;
};

export const usePauseTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<PauseTimerResponse, Error, string>({
    mutationFn: async (timerId: string) => {
      return await ApiClient.put<PauseTimerResponse>(
        `/api/timers/${timerId}`,
        undefined,
        getAuthHeaders()
      );
    },
    onSuccess: () => {
      // 타이머 상태 갱신
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
  });
};
