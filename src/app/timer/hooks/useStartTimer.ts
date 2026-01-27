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
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
    onError: (error) => {
      if (error.message.includes("409")) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
      }
    },
  });
};
