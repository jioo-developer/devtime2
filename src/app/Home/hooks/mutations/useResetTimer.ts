import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { ResponseMessage, TimerIdWithData } from "./type";

export const useResetTimer = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseMessage, Error, TimerIdWithData>({
    mutationFn: async ({ timerId }) => {
      return await ApiClient.delete<ResponseMessage>(
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
