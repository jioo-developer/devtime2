import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

type ResetTimerResponse = {
  message: string;
};

export const useResetTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<ResetTimerResponse, Error, string>({
    mutationFn: async (timerId: string) => {
      return await ApiClient.delete<ResetTimerResponse>(
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
