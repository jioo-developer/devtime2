import { useEffect } from "react";
import { TimerResponse } from "./useGetTimers";
import { useTimerContext } from "../../provider/TimerContext";

export function useRestoreTimer({ timerData }: { timerData: TimerResponse | undefined }) {
  const { setIsTimerRunning, setIsTimerPaused } = useTimerContext();

  useEffect(() => {
    if (timerData?.timerId && timerData?.startTime) {
      setIsTimerRunning(true);
      setIsTimerPaused(false);
    } else {
      setIsTimerRunning(false);
      setIsTimerPaused(false);
    }
  }, [timerData, setIsTimerRunning, setIsTimerPaused]);
}
