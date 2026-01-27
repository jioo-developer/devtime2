import { useEffect, useRef, useState } from "react";
import {
  stopInterval,
  resetState,
  enterPaused,
  exitPaused,
  getTotalPausedMs,
  type TimerRefs,
} from "./ElapsedTimerHelper";

export type UseElapsedTimerParams = {
  startTime: string | undefined; // ISO date string
  isTimerRunning: boolean;
  isTimerPaused: boolean;
};

export function useElapsedTimerCore({
  startTime,
  isTimerRunning,
  isTimerPaused,
}: UseElapsedTimerParams) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const refs = useRef<TimerRefs>({
    intervalId: null,
    pauseStartMs: null,
    totalPausedMs: 0,
  });

  useEffect(() => {
    const timer = refs.current;

    // 0) 실행 조건이 깨지면: 항상 "완전 리셋"
    if (!isTimerRunning || !startTime) {
      resetState(timer, setElapsedSeconds);
      return;
    }

    // 1) 일시정지면: pause 상태 진입(시각 기록 + interval stop)
    if (isTimerPaused) {
      enterPaused(timer);
      return;
    }

    // 2) 일시정지 해제면: 누적 paused 반영
    exitPaused(timer);

    // 3) tick: startTime + 누적 paused 기준으로 elapsed 계산해서 state 반영
    const tick = () => {
      const startMs = new Date(startTime).getTime();
      const nowMs = Date.now();
      const elapsed = Math.floor((nowMs - startMs - timer.totalPausedMs) / 1000);
      setElapsedSeconds(Math.max(0, elapsed));
    };

    // 4) 즉시 1회 반영 후, 1초마다 갱신
    tick();
    timer.intervalId = setInterval(tick, 1000);

    // 5) cleanup: interval 정리
    return () => stopInterval(timer);
  }, [startTime, isTimerRunning, isTimerPaused]);

  // pausedDurationMs는 "현재 paused 중인 시간"까지 포함한 총합으로 반환
  const pausedDurationMs =
    startTime && isTimerRunning
      ? getTotalPausedMs(refs.current, isTimerPaused)
      : 0;

  return {
    elapsedSeconds,
    pausedDurationMs,
  };
}
