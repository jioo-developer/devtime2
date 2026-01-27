"use client";
import "./style.css";
import { useRouter } from "next/navigation";
import { useTimerModal } from "./hooks/useTimerModal";
import { useGetTimers } from "./hooks/getter/useGetTimers";
import { useGetStudyLog } from "./hooks/getter/useGetStudyLog";
import { useRestoreTimer } from "./hooks/useRestoreTimer";
import { useTimerDisplay } from "./hooks/useTimerDisplay";
import { useResetTimerAction } from "./hooks/useResetTimer";
import { useIsLoggedIn } from "./hooks/useIsLoggedIn";
import { useTimerStore } from "@/store/timerStore";
import { useModalStore } from "@/store/modalStore";
import { TimerControls } from "./component/TimerControls";
import { TimerDisplay } from "./component/TimerDisplay";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

export default function TimerPage() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const todoTitle = useTimerStore((state) => state.todoTitle);
  const startTimeFromStore = useTimerStore((state) => state.startTime);
  const totalPausedDuration = useTimerStore((state) => state.totalPausedDuration);
  const { data: timerData } = useGetTimers(isLoggedIn);
  const { data: studyLogData } = useGetStudyLog(timerData?.studyLogId);
  const { openTimerModal } = useTimerModal();
  const { resetTimer } = useResetTimerAction();
  const pushModal = useModalStore((state) => state.push);
  const closeTop = useModalStore((state) => state.closeTop);

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

  const openLoginRequiredModal = () => {
    pushModal({
      width: 360,
      title: "로그인 필요",
      content: "로그인이 필요한 서비스입니다.",
      showCloseButton: false,
      BackdropMiss: true,
      footer: (
        <CommonButton
          theme="primary"
          onClick={() => {
            closeTop();
            router.push("/login");
          }}
        >
          로그인 하러가기
        </CommonButton>
      ),
    });
  };

  return (
    <main className="mainPageWrap">
      <div className="timerContainer" style={{ position: "relative" }}>
        {!isLoggedIn && (
          <div
            role="button"
            tabIndex={0}
            aria-label="로그인이 필요합니다"
            className="loginRequiredOverlay"
            onClick={openLoginRequiredModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openLoginRequiredModal();
            }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              cursor: "pointer",
            }}
          />
        )}
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
