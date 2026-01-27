"use client";

import { useTimerContext } from "@/app/timer/provider/TimerContext";
import { useTimerMutations } from "../mutations";
import { getCurrentSplitTimes } from "@/app/timer/utils/calculateSplitTimes";

export function usePauseTimerAction() {
  const { setIsTimerPaused } = useTimerContext();
  const { pauseTimerMutation } = useTimerMutations();

  const pauseTimer = (timerId?: string, startTime?: string, pausedDuration?: number) => {
    if (timerId && startTime) {
      const splitTimes = getCurrentSplitTimes(startTime, pausedDuration ?? 0);
      pauseTimerMutation.mutate(
        { timerId, data: splitTimes },
        {
          onSuccess: () => setIsTimerPaused(true),
          onError: (error: Error) => console.error("타이머 일시정지 실패:", error),
        }
      );
    } else {
      setIsTimerPaused(true);
    }
  };

  return { pauseTimer };
}
