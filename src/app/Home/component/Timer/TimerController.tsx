"use client";
import React from "react";
import { useGetTimers } from "../../hooks/useGetTimers";
import { useRestoreTimer } from "../../hooks/useRestoreTimer";
import { useTimerActions } from "./hooks/useTimerActions";
import { useElapsedTimer } from "./hooks/useElapsedTimer";
import { useTimerContext } from "../../provider/TimerContext";
import { TimerView } from "./Timer";

function Timer() {
    const { data: timerData } = useGetTimers();
    const { isTimerRunning, isTimerPaused, todoTitle } = useTimerContext();
    const { startTimer, pauseTimer, showListTimer, resetTimer, finishTimer } = useTimerActions();
    useRestoreTimer({ timerData });

    const { hours, minutes, seconds } = useElapsedTimer({
        startTime: timerData?.startTime,
        isTimerRunning,
        isTimerPaused,
    });

    return (
        <TimerView
            todoTitle={todoTitle}
            isTimerRunning={isTimerRunning}
            isTimerPaused={isTimerPaused}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            onStartClick={() => startTimer(timerData?.timerId)}
            onPauseClick={() => pauseTimer(timerData?.timerId)}
            onFinishClick={finishTimer}
            onShowListClick={showListTimer}
            onResetClick={() => resetTimer(timerData?.timerId)}
        />
    );
}

export default Timer;
