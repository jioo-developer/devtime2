"use client";

import React from "react";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import StartOn from "@/asset/images/Start_on.svg";
import StartOff from "@/asset/images/Start_off.svg";
import PauseOn from "@/asset/images/Pause_on.svg";
import PauseOff from "@/asset/images/Pause_off.svg";
import FinishOn from "@/asset/images/Finish_on.svg";
import FinishOff from "@/asset/images/Finish_off.svg";
import showListIcon from "@/asset/images/showList.svg";
import ResetIcon from "@/asset/images/Reset.svg";
import { useTimerContext } from "@/app/timer/provider/TimerContext";
import { useGetTimers } from "./hooks/getter/useGetTimers";
import { useRestoreTimer } from "./hooks/getter/useRestoreTimer";
import { useTimerActions } from "./hooks/actions";
import { useElapsedTimer } from "./hooks/timeHandle/ElapsedTimerHelper";
import { useTimerSync } from "./hooks/timeHandle/useTimerSync";
import styles from "./style.module.css";
import "./style.css";

export default function TimerPage() {
  const { data: timerData } = useGetTimers();
  const { isTimerRunning, isTimerPaused, todoTitle } = useTimerContext();
  const { startTimer, pauseTimer, showListTimer, resetTimer, finishTimer } = useTimerActions();
  const { hours, minutes, seconds, pausedDuration } = useElapsedTimer({
    startTime: timerData?.startTime,
    isTimerRunning,
    isTimerPaused,
  });

  useRestoreTimer({ timerData });
  useTimerSync({
    timerId: timerData?.timerId,
    startTime: timerData?.startTime,
    isTimerRunning,
    isTimerPaused,
    pausedDuration,
  });

  const isStartDisabled = isTimerRunning && !isTimerPaused;
  const isPauseDisabled = !isTimerRunning || isTimerPaused;
  const isFinishDisabled = !isTimerRunning;

  return (
    <main className="mainPageWrap">
      <div className={styles.timerContainer}>
        <h2 className={styles.timerTitle}>{todoTitle}</h2>
        <div className={styles.timerDisplay}>
          <div className={styles.timeSegment}>
            <div className={styles.timeValue}>{hours}</div>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.timeSegment}>
            <div className={styles.timeValue}>{minutes}</div>
          </div>
          <span className={styles.colon}>:</span>
          <div className={styles.timeSegment}>
            <div className={styles.timeValue}>{seconds}</div>
          </div>
        </div>

        <div className={styles.controls}>
          <CommonButton
            theme="none"
            className={styles.startButton}
            aria-label="시작"
            title={isTimerPaused ? "타이머 재개" : "타이머 시작"}
            onClick={() => startTimer(timerData?.timerId, timerData?.startTime, pausedDuration)}
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
            className={styles.pauseButton}
            aria-label="일시정지"
            title="타이머 일시정지"
            onClick={() => pauseTimer(timerData?.timerId, timerData?.startTime, pausedDuration)}
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
            className={styles.finishButton}
            aria-label="종료"
            title="타이머 종료"
            onClick={() =>
              finishTimer(
                timerData?.timerId,
                timerData?.startTime,
                timerData?.studyLogId,
                pausedDuration
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

          {isTimerRunning && (
            <div className={styles.isTimerRunning}>
              <CommonButton
                theme="none"
                className={styles.finishButton}
                aria-label="할일 목록"
                title="할일 목록"
                onClick={() => showListTimer(timerData?.studyLogId)}
              >
                <CommonImage src={showListIcon} alt="할일 목록" width={64} height={64} />
              </CommonButton>

              <CommonButton
                theme="none"
                className={styles.finishButton}
                aria-label="초기화"
                title="초기화"
                onClick={() => resetTimer(timerData?.timerId)}
              >
                <CommonImage src={ResetIcon} alt="초기화" width={64} height={64} />
              </CommonButton>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
