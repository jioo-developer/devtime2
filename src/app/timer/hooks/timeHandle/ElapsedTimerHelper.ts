import { useElapsedTimerCore, type UseElapsedTimerParams } from "./useElapsedTimer";

export type TimerRefs = {
    intervalId: ReturnType<typeof setInterval> | null;
    pauseStartMs: number | null;   // "현재" 일시정지 시작 시각
    totalPausedMs: number;         // "누적" 일시정지 시간
};

export function stopInterval(refs: TimerRefs) {
    if (!refs.intervalId) return;
    clearInterval(refs.intervalId);
    refs.intervalId = null;
}

export function resetState(refs: TimerRefs, setElapsedSeconds: (v: number) => void) {
    setElapsedSeconds(0);
    refs.pauseStartMs = null;
    refs.totalPausedMs = 0;
    stopInterval(refs);
}

export function calcElapsedSeconds(startTime: string, totalPausedMs: number) {
    const startMs = new Date(startTime).getTime();
    const nowMs = Date.now();
    const elapsed = Math.floor((nowMs - startMs - totalPausedMs) / 1000);
    return Math.max(0, elapsed);
}

/**
 * 일시정지 상태일 때 pauseStartMs를 보장하고 interval을 멈춘다.
 */
export function enterPaused(refs: TimerRefs) {
    if (refs.pauseStartMs === null) {
        refs.pauseStartMs = Date.now();
    }
    stopInterval(refs);
}

/**
 * 일시정지 해제 시점에 pauseStartMs를 누적(totalPausedMs)에 반영한다.
 */
export function exitPaused(refs: TimerRefs) {
    if (refs.pauseStartMs === null) return;
    refs.totalPausedMs += Date.now() - refs.pauseStartMs;
    refs.pauseStartMs = null;
}

/**
 * 현재까지의 "총 일시정지 ms"를 반환한다.
 * - 누적(totalPausedMs)
 * - + (현재 paused 중이라면) pauseStartMs부터 지금까지
 */
export function getTotalPausedMs(refs: TimerRefs, isTimerPaused: boolean) {
    let total = refs.totalPausedMs;

    if (isTimerPaused && refs.pauseStartMs !== null) {
        total += Date.now() - refs.pauseStartMs;
    }

    return total;
}

function formatHMS(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
    };
}

export function useElapsedTimer(params: UseElapsedTimerParams) {
    const { elapsedSeconds, pausedDurationMs } = useElapsedTimerCore(params);

    const time = formatHMS(elapsedSeconds);

    return {
        ...time,
        pausedDuration: pausedDurationMs,
    };
}
