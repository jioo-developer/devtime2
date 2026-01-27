"use client";
import "./style.css";
import { useTimerModal } from "./hooks/useTimerModal";
import { useGetTimers } from "./hooks/getter/useGetTimers";
import { useGetStudyLog } from "./hooks/getter/useGetStudyLog";
import { useRestoreTimer } from "./hooks/useRestoreTimer";
import { useTimerDisplay } from "./hooks/useTimerDisplay";
import { useResetTimerAction } from "./hooks/useResetTimer";
import { useTimerStore } from "@/store/timerStore";
import { TimerControls } from "./component/TimerControls";
import { TimerDisplay } from "./component/TimerDisplay";

export default function TimerPage() {
  const todoTitle = useTimerStore((state) => state.todoTitle);
  const startTimeFromStore = useTimerStore((state) => state.startTime);
  const totalPausedDuration = useTimerStore((state) => state.totalPausedDuration);
  const { data: timerData } = useGetTimers();
  const { data: studyLogData } = useGetStudyLog(timerData?.studyLogId);
  const { openTimerModal } = useTimerModal();
  const { resetTimer } = useResetTimerAction();

  useRestoreTimer(timerData, studyLogData);

  const {
    hours,
    minutes,
    seconds,
    isTimerRunning,
    isTimerPaused,
    onPauseClick,
    onResumeClick,
    isStartDisabled,
    isPauseDisabled,
    isFinishDisabled,
  } = useTimerDisplay(timerData);

  const effectiveStartTime = timerData?.startTime || startTimeFromStore;

  const handleStartOrResume = () =>
    isTimerPaused ? onResumeClick() : openTimerModal("create");

  const handleFinish = () => {
    if (!timerData?.timerId || !effectiveStartTime) return;
    openTimerModal("end", timerData.studyLogId, {
      timerId: timerData.timerId,
      startTime: effectiveStartTime,
      pausedDuration: totalPausedDuration ?? 0,
    });
  };

  const handleOpenEdit = () => openTimerModal("edit", timerData?.studyLogId);
  const handleReset = () => resetTimer(timerData?.timerId);

  return (
    <main className="mainPageWrap">
      <div className="timerContainer">
        <h2 className="timerTitle">{todoTitle}</h2>

        <TimerDisplay hours={hours} minutes={minutes} seconds={seconds} />

        <TimerControls
          isTimerRunning={isTimerRunning}
          isTimerPaused={isTimerPaused}
          isStartDisabled={isStartDisabled}
          isPauseDisabled={isPauseDisabled}
          isFinishDisabled={isFinishDisabled}
          onStartOrResume={handleStartOrResume}
          onPause={onPauseClick}
          onFinish={handleFinish}
          onOpenEdit={handleOpenEdit}
          onReset={handleReset}
        />
      </div>
    </main>
  );
}
