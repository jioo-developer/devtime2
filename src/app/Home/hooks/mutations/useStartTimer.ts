import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";

type StartTimerRequest = {
  todayGoal: string;
  tasks: string[];
};

export type StartTimerResponse = {
  message: string;
  studyLogId: string;
  timerId: string;
  startTime: string; // ISO date string
};

export const useStartTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<StartTimerResponse, Error, StartTimerRequest>({
    mutationFn: async (data) => {
      return await ApiClient.post<StartTimerResponse>(
        "/api/timers",
        data,
        getAuthHeaders(),
        {
          onNotOk: async (response) => {
            let message = "POST /api/timers failed";

            if (response.status === 409) {
              const { error } = await response.json();
              message = `POST /api/timers failed: ${error.message}`;
            }

            throw new Error(message);
          }
        },
      );
    },
    onSuccess: () => {
      // 타이머 상태 갱신
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
    onError: (error) => {
      // 409 Conflict 에러 발생 시에도 타이머 상태 갱신 (기존 타이머 복원)
      if (error.message.includes("409")) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
      }
    },
  });
};
