"use client";
import React from "react";
import { useGetTimers } from "../../hooks/useGetTimers";
import { useRestoreTimer } from "../../hooks/useRestoreTimer";
import { useTimerActions } from "./hooks/useTimerActions";
import { useTimerContext } from "../../provider/TimerContext";
import { TimerView } from "./Timer";

function Timer() {
    const { data: timerData } = useGetTimers();
    const { isTimerRunning, isTimerPaused, todoTitle } = useTimerContext();
    const { startTimer, pauseTimer, showListTimer, resetTimer, finishTimer } = useTimerActions();
    useRestoreTimer({ timerData });

    return (
        <TimerView
            todoTitle={todoTitle}
            isTimerRunning={isTimerRunning}
            isTimerPaused={isTimerPaused}
            onStartClick={startTimer}
            onPauseClick={pauseTimer}
            onFinishClick={finishTimer}
            onShowListClick={showListTimer}
            onResetClick={resetTimer}
        />
    );
}

export default Timer;
