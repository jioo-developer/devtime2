"use client";
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

export type TimerControlsProps = {
  isTimerRunning: boolean;
  isTimerPaused: boolean;
  isStartDisabled: boolean;
  isPauseDisabled: boolean;
  isFinishDisabled: boolean;
  onStartOrResume: () => void;
  onPause: () => void;
  onFinish: () => void;
  onOpenEdit: () => void;
  onReset: () => void;
};

export function TimerControls({
  isTimerRunning,
  isTimerPaused,
  isStartDisabled,
  isPauseDisabled,
  isFinishDisabled,
  onStartOrResume,
  onPause,
  onFinish,
  onOpenEdit,
  onReset,
}: TimerControlsProps) {
  return (
    <div className="controls">
      <CommonButton
        theme="none"
        className="startButton"
        aria-label="시작"
        title={isTimerPaused ? "타이머 재개" : "타이머 시작"}
        onClick={onStartOrResume}
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
        onClick={onPause}
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
        onClick={onFinish}
        disabled={isFinishDisabled}
      >
        <CommonImage
          src={isTimerRunning ? FinishOn : FinishOff}
          alt="종료"
          width={100}
          height={100}
        />
      </CommonButton>

      <div className={clsx("isTimerRunning", !isTimerRunning && "isTimerRunningHidden")}>
        <CommonButton
          theme="none"
          className="finishButton"
          aria-label="할일 목록"
          title="할일 목록"
          onClick={onOpenEdit}
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
          onClick={onReset}
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
  );
}
