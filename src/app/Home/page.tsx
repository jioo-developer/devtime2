"use client";

import "./style.css";
import { TimerControls } from "./component/TimerControls";
import { TimerDisplay } from "./component/TimerDisplay";
import { useTimerPageController } from "./hooks/useTimerPageController";
import { useLoginRequiredModal } from "./hooks/useIsLoggedIn";

/**
 * 타이머 페이지. 데이터·핸들러는 useTimerPageController, 로그인 모달은 useLoginRequiredModal에 위임하고
 * 여기서는 레이아웃·조립만 한다.
 */
export default function TimerPage() {
  const {
    isLoggedIn,
    isReady,
    todoTitle,
    isTimerRunning,
    isTimerPaused,
    display,
    handlers,
  } = useTimerPageController();

  useLoginRequiredModal(isLoggedIn, isReady);

  return (
    <main className="mainPageWrap">
      <div className="timerContainer">
        <h2 className="timerTitle">{todoTitle}</h2>

        <TimerDisplay
          hours={display.hours}
          minutes={display.minutes}
          seconds={display.seconds}
        />

        <TimerControls
          isTimerRunning={isTimerRunning}
          isTimerPaused={isTimerPaused}
          isStartDisabled={display.isStartDisabled}
          isPauseDisabled={display.isPauseDisabled}
          isFinishDisabled={display.isFinishDisabled}
          onStartOrResume={handlers.onStartOrResume}
          onPause={handlers.onPause}
          onFinish={handlers.onFinish}
          onOpenEdit={handlers.onOpenEdit}
          onReset={handlers.onReset}
        />
      </div>
    </main>
  );
}
