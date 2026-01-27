import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { useModalStore } from "@/store/modalStore";
import { useTimerStore } from "@/store/timerStore";

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
  const {
    setTodoTitle,
    setSavedTodos,
    setIsTimerRunning,
    setStartTime,
    setClientStartedAt,
    setTotalPausedDuration,
  } = useTimerStore.getState();
  const closeTop = useModalStore.getState().closeTop;

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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
      setTodoTitle(variables.todayGoal);
      setSavedTodos(variables.tasks);
      setStartTime(data.startTime);
      setClientStartedAt(Date.now());
      setTotalPausedDuration(0);
      setIsTimerRunning(true);
      closeTop();
    },
    onError: (error) => {
      if (error.message.includes("409")) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
        closeTop();
      }
    },
  });
};
