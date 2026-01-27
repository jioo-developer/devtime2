import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { getAuthHeaders } from "@/utils/authUtils";
import { SplitTime } from "@/app/timer/utils/calculateSplitTimes";
import { ResponseMessage, TimerIdWithData } from "./type";

interface SyncTimerVariables extends TimerIdWithData {
  data: SplitTime[];
};

export const useSyncTimer = () => {
  return useMutation<ResponseMessage, Error, SyncTimerVariables>({
    mutationFn: async ({ timerId, data }) => {
      return await ApiClient.put<ResponseMessage>(
        `/api/timers/${timerId}`,
        data,
        getAuthHeaders()
      );
    },
  });
};
