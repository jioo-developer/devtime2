import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { QueryKey } from "@/constant/queryKeys";
import { getAuthHeaders } from "@/utils/authUtils";
import { SplitTime } from "../utils/calculateSplitTimes";

type FinishTimerRequest = {
  splitTimes: SplitTime[];
  tasks: string[]; // 최종 할 일 목록
  reflection: string; // 학습 회고
};

type FinishTimerResponse = {
  message: string;
};

export const useFinishTimer = () => {
  const queryClient = useQueryClient();

  return useMutation<FinishTimerResponse, Error, { timerId: string; data: FinishTimerRequest }>({
    mutationFn: async ({ timerId, data }) => {
      // 요구사항에는 GET으로 명시되어 있지만, Body를 보내야 하므로 POST로 구현
      // 실제 API가 GET이면 수정 필요
      return await ApiClient.post<FinishTimerResponse>(
        `/api/timers/${timerId}/stop`,
        data,
        getAuthHeaders()
      );
    },
    onSuccess: () => {
      // 타이머 상태 갱신
      queryClient.invalidateQueries({ queryKey: [QueryKey.TIMERS] });
    },
  });
};
