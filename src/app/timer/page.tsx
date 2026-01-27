"use client";

import "./style.css";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import StartOff from "@/asset/images/start_off.svg";
import StartOn from "@/asset/images/start_on.svg";
import PauseOff from "@/asset/images/pause_off.svg";
import PauseOn from "@/asset/images/pause_on.svg";
import FinishOff from "@/asset/images/finish_off.svg";
import FinishOn from "@/asset/images/finish_on.svg";
import showListIcon from "@/asset/images/showList.svg";
import ResetIcon from "@/asset/images/reset.svg";
import clsx from "clsx";
import { useTimerModal } from "./hooks/useTimerModal";
import { useGetTimers } from "./hooks/useGetTimers";
import { useGetStudyLog } from "./hooks/useGetStudyLog";
import { useRestoreTimer } from "./hooks/useRestoreTimer";
import { useTimerDisplay } from "./hooks/useTimerDisplay";
import { useFinishTimerAction } from "./hooks/actions/useFinishTimerAction";
import { useResetTimerAction } from "./hooks/actions/useResetTimerAction";
import { useTimerStore } from "@/store/timerStore";

export default function TimerPage() {
  const todoTitle = useTimerStore((state) => state.todoTitle);
  const startTimeFromStore = useTimerStore((state) => state.startTime);
  const totalPausedDuration = useTimerStore((state) => state.totalPausedDuration);
  const { data: timerData } = useGetTimers();
  const { data: studyLogData } = useGetStudyLog(timerData?.studyLogId);

  useRestoreTimer(timerData, studyLogData);
  const { openTimerModal } = useTimerModal();
  const { finishTimer } = useFinishTimerAction();
  const { resetTimer } = useResetTimerAction();

  const effectiveStartTime = timerData?.startTime || startTimeFromStore;

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

  return (
    <main className="mainPageWrap">
      <div className="timerContainer">
        <h2 className="timerTitle">{todoTitle}</h2>

        <div className="timerDisplay">
          <div className="timeSegment">
            <div className="timeValue">{hours}</div>
          </div>
          <span className="colon">:</span>
          <div className="timeSegment">
            <div className="timeValue">{minutes}</div>
          </div>
          <span className="colon">:</span>
          <div className="timeSegment">
            <div className="timeValue">{seconds}</div>
          </div>
        </div>

        <div className="controls">
          <CommonButton
            theme="none"
            className="startButton"
            aria-label="시작"
            title={isTimerPaused ? "타이머 재개" : "타이머 시작"}
            onClick={() => (isTimerPaused ? onResumeClick() : openTimerModal("create"))}
            disabled={isStartDisabled}
          >
            <CommonImage
              src={isTimerRunning && !isTimerPaused ? StartOff : StartOn}
              alt="시작"
              width={100}
              height={100}
            />
          </CommonButton>

          <CommonButton
            theme="none"
            className="pauseButton"
            aria-label="일시정지"
            title="타이머 일시정지"
            onClick={onPauseClick}
            disabled={isPauseDisabled}
          >
            <CommonImage
              src={isTimerRunning && !isTimerPaused ? PauseOn : PauseOff}
              alt="일시정지"
              width={100}
              height={100}
            />
          </CommonButton>

          <CommonButton
            theme="none"
            className="finishButton"
            aria-label="종료"
            title="타이머 종료"
            onClick={() =>
              finishTimer(
                timerData?.timerId,
                effectiveStartTime,
                timerData?.studyLogId,
                totalPausedDuration
              )
            }
            disabled={isFinishDisabled}
          >
            <CommonImage
              src={isTimerRunning ? FinishOn : FinishOff}
              alt="종료"
              width={100}
              height={100}
            />
          </CommonButton>

          <div className={clsx("isTimerRunning", !isTimerRunning && "isTimerRunningHidden")}
          >
            <CommonButton
              theme="none"
              className="finishButton"
              aria-label="할일 목록"
              title="할일 목록"
              onClick={() => openTimerModal("edit", timerData?.studyLogId)}
            >
              <CommonImage
                src={showListIcon}
                alt="할일 목록"
                width={64}
                height={64}
              />
            </CommonButton>

            <CommonButton
              theme="none"
              className="finishButton"
              aria-label="초기화"
              title="초기화"
              onClick={() => resetTimer(timerData?.timerId)}
            >
              <CommonImage
                src={ResetIcon}
                alt="초기화"
                width={64}
                height={64}
              />
            </CommonButton>
          </div>
        </div>
      </div>
    </main>
  );
}
