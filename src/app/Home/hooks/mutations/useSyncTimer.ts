import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { getAuthHeaders } from "@/utils/authUtils";
import { SplitTime } from "../../utils/calculateSplitTimes";

type SyncTimerRequest = {
  splitTimes: SplitTime[];
};

type SyncTimerResponse = {
  message: string;
};

export const useSyncTimer = () => {
  return useMutation<SyncTimerResponse, Error, { timerId: string; data: SyncTimerRequest }>({
    mutationFn: async ({ timerId, data }) => {
      return await ApiClient.put<SyncTimerResponse>(
        `/api/timers/${timerId}`,
        data,
        getAuthHeaders()
      );
    },
  });
};
