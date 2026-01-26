import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

type ResumeTimerResponse = {
  message: string;
};

export const useResumeTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<ResumeTimerResponse, Error, string>({
    mutationFn: async (timerId: string) => {
      return await ApiClient.put<ResumeTimerResponse>(
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
