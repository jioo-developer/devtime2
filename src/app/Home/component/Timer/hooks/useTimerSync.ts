import { useEffect, useRef } from "react";
import { useSyncTimer } from "../../../hooks/mutations/useSyncTimer";
import { calculateSplitTimes } from "../../../utils/calculateSplitTimes";

type UseTimerSyncParams = {
  timerId: string | undefined;
  startTime: string | undefined;
  isTimerRunning: boolean;
  isTimerPaused: boolean;
  pausedDuration: number;
};

const SYNC_INTERVAL_MS = 10 * 60 * 1000; // 10분

export function useTimerSync({
  timerId,
  startTime,
  isTimerRunning,
  isTimerPaused,
  pausedDuration,
}: UseTimerSyncParams) {
  const syncTimerMutation = useSyncTimer();
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncTimeRef = useRef<number>(0);

  useEffect(() => {
    // 타이머가 실행 중이고 일시정지되지 않았을 때만 동기화
    if (!timerId || !startTime || !isTimerRunning || isTimerPaused) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      lastSyncTimeRef.current = 0;
      return;
    }

    // 즉시 첫 동기화
    const performSync = () => {
      const splitTimes = calculateSplitTimes(startTime, new Date(), pausedDuration);
      syncTimerMutation.mutate(
        {
          timerId,
          data: { splitTimes },
        },
        {
          onError: () => {
            // 동기화 실패 시 무시 (다음 동기화에서 재시도)
          },
        }
      );
      lastSyncTimeRef.current = Date.now();
    };

    // 첫 동기화 (마지막 동기화로부터 10분이 지났으면)
    const timeSinceLastSync = Date.now() - lastSyncTimeRef.current;
    if (timeSinceLastSync >= SYNC_INTERVAL_MS) {
      performSync();
    }

    // 10분마다 동기화
    syncIntervalRef.current = setInterval(() => {
      performSync();
    }, SYNC_INTERVAL_MS);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [timerId, startTime, isTimerRunning, isTimerPaused, pausedDuration, syncTimerMutation]);
}
