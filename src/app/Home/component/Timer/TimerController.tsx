"use client";
import React from "react";
import { useGetTimers } from "../../hooks/useGetTimers";
import { useRestoreTimer } from "../../hooks/useRestoreTimer";
import { useTimerActions } from "./hooks/useTimerActions";
import { useElapsedTimer } from "./hooks/useElapsedTimer";
import { useTimerSync } from "./hooks/useTimerSync";
import { useTimerContext } from "../../provider/TimerContext";
import { TimerView } from "./Timer";

function Timer() {
    const { data: timerData } = useGetTimers();
    const { isTimerRunning, isTimerPaused, todoTitle } = useTimerContext();
    const { startTimer, pauseTimer, showListTimer, resetTimer, finishTimer } = useTimerActions();
    useRestoreTimer({ timerData });

    const { hours, minutes, seconds, pausedDuration } = useElapsedTimer({
        startTime: timerData?.startTime,
        isTimerRunning,
        isTimerPaused,
    });

    // 타이머 재생 중 10분 주기 자동 동기화
    useTimerSync({
        timerId: timerData?.timerId,
        startTime: timerData?.startTime,
        isTimerRunning,
        isTimerPaused,
        pausedDuration,
    });

    return (
        <TimerView
            todoTitle={todoTitle}
            isTimerRunning={isTimerRunning}
            isTimerPaused={isTimerPaused}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            onStartClick={() => startTimer(timerData?.timerId, timerData?.startTime, pausedDuration)}
            onPauseClick={() => pauseTimer(timerData?.timerId, timerData?.startTime, pausedDuration)}
            onFinishClick={() => finishTimer(timerData?.timerId, timerData?.startTime, timerData?.studyLogId, pausedDuration)}
            onShowListClick={() => showListTimer(timerData?.studyLogId)}
            onResetClick={() => resetTimer(timerData?.timerId)}
        />
    );
}

export default Timer;
