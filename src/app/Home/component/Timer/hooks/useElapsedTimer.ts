import { useState, useEffect, useRef } from "react";

type UseElapsedTimerParams = {
  startTime: string | undefined; // ISO date string
  isTimerRunning: boolean;
  isTimerPaused: boolean;
};

export function useElapsedTimer({
  startTime,
  isTimerRunning,
  isTimerPaused,
}: UseElapsedTimerParams) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseStartRef = useRef<number | null>(null);
  const pausedDurationRef = useRef<number>(0);

  useEffect(() => {
    if (!startTime || !isTimerRunning) {
      setElapsedSeconds(0);
      pausedDurationRef.current = 0;
      pauseStartRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (isTimerPaused) {
      // 일시정지 시작
      if (pauseStartRef.current === null) {
        pauseStartRef.current = Date.now();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 일시정지 해제
    if (pauseStartRef.current !== null) {
      const pauseDuration = Date.now() - pauseStartRef.current;
      pausedDurationRef.current += pauseDuration;
      pauseStartRef.current = null;
    }

    // 경과 시간 계산
    const calculateElapsed = () => {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - start - pausedDurationRef.current) / 1000);
      return Math.max(0, elapsed);
    };

    // 초기 값 설정
    setElapsedSeconds(calculateElapsed());

    // 1초마다 업데이트
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startTime, isTimerRunning, isTimerPaused]);

  // 초를 시:분:초로 변환
  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}
