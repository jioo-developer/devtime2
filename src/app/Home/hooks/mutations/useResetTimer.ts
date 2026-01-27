import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

type ResetTimerRequest = { timerId: string };
type ResponseMessage = { message: string };

export const useResetTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseMessage, Error, ResetTimerRequest>({
    mutationFn: async ({ timerId }) => {
      return await ApiClient.delete<ResponseMessage>(
        `/api/timers/${timerId}`,
        undefined,
        getAuthHeaders()
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
  });
};
