"use client";
import React from "react";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import StartOn from "@/asset/images/Start_on.svg";
import StartOff from "@/asset/images/Start_off.svg";
import PauseOn from "@/asset/images/Pause_on.svg";
import PauseOff from "@/asset/images/Pause_off.svg";
import FinishOn from "@/asset/images/Finish_on.svg";
import FinishOff from "@/asset/images/Finish_off.svg";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import styles from "./style.module.css";
import showListIcon from "@/asset/images/showList.svg";
import ResetIcon from "@/asset/images/Reset.svg";
import { UseQueryResult } from "@tanstack/react-query";
import { TimerResponse, useGetTimers } from "../../hooks/useGetTimers";
import { useTimerActions } from "./hooks/useTimerActions";
import { useTimerContext } from "../../provider/TimerContext";

function Timer() {
  const { data: timerData } = useGetTimers() as UseQueryResult<TimerResponse, Error>;
  const { isTimerRunning, todoTitle } = useTimerContext();
  const { startTimer, showListTimer, resetTimer, finishTimer } = useTimerActions();

  console.log(timerData);

  return (
    <div className={styles.timerContainer}>
      <h2 className={styles.timerTitle}>{todoTitle}</h2>
      <div className={styles.timerDisplay}>
        <div className={styles.timeSegment}>
          <div className={styles.timeValue}>00</div>
        </div>
        <span className={styles.colon}>:</span>
        <div className={styles.timeSegment}>
          <div className={styles.timeValue}>00</div>
        </div>
        <span className={styles.colon}>:</span>
        <div className={styles.timeSegment}>
          <div className={styles.timeValue}>00</div>
        </div>
      </div>

      <div className={styles.controls}>
        <CommonButton
          theme="none"
          className={styles.startButton}
          aria-label="시작"
          onClick={startTimer}
          title="타이머 시작"
          disabled={isTimerRunning}
        >
          <CommonImage src={isTimerRunning ? StartOff : StartOn} alt="시작" width={100} height={100} />
        </CommonButton>

        <CommonButton theme="none" className={styles.pauseButton} aria-label="일시정지" title="타이머 일시정지">
          <CommonImage
            src={isTimerRunning ? PauseOn : PauseOff}
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
          onClick={finishTimer}
        >
          <CommonImage src={isTimerRunning ? FinishOn : FinishOff} alt="종료" width={100} height={100} />
        </CommonButton>

        {isTimerRunning && (
          <div className={styles.isTimerRunning}>
            <CommonButton
              theme="none"
              className={styles.finishButton}
              aria-label="할일 목록"
              title="할일 목록"
              onClick={showListTimer}
            >
              <CommonImage src={showListIcon} alt="할일 목록" width={64} height={64} />
            </CommonButton>

            <CommonButton
              theme="none"
              className={styles.finishButton}
              aria-label="초기화"
              title="초기화"
              onClick={resetTimer}
            >
              <CommonImage src={ResetIcon} alt="초기화" width={64} height={64} />
            </CommonButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timer;
