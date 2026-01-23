"use client";
import React from "react";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import StartOn from "@/asset/images/Start_on.svg";
import PauseOff from "@/asset/images/Pause_off.svg";
import FinishOff from "@/asset/images/Finish_off.svg";
import { useModalStore } from "@/store/modalStore";
import TodoListForm from "@/app/Home/component/Form/Form";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import styles from "./style.module.css";

type TimerProps = {
  timerId?: string;
  studyLogId?: string;
  startTime?: string; // ISO date string
  // TODO: 타이머 복원을 위한 추가 props (목표, 할 일, splitTimes 등)
  // goal?: string;
  // todo?: string;
  // splitTimes?: unknown[];
};

function Timer({ timerId, studyLogId, startTime }: TimerProps = {}) {
  console.log(timerId, studyLogId, startTime);
  const push = useModalStore((state) => state.push);
  const closeTop = useModalStore((state) => state.closeTop);

  const handleStartClick = () => {
    push({
      width: 640,
      height: 828,
      content: <TodoListForm />,
      showCloseButton: false,
      footer: (
        <div className={styles.footer}>
          <CommonButton theme="secondary" onClick={() => closeTop()}>
            취소
          </CommonButton>
          <CommonButton theme="primary" onClick={() => closeTop()}>
            타이머 시작하기
          </CommonButton>
        </div>
      ),
      BackdropMiss: false,
    });
  };

  return (
    <div className={styles.timerContainer}>
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
        <button
          className={styles.startButton}
          aria-label="시작"
          onClick={handleStartClick}
        >
          <CommonImage src={StartOn} alt="시작" width={100} height={100} />
        </button>

        <button className={styles.pauseButton} aria-label="일시정지">
          <CommonImage
            src={PauseOff}
            alt="일시정지"
            width={100}
            height={100}
          />
        </button>

        <button className={styles.finishButton} aria-label="종료">
          <CommonImage src={FinishOff} alt="종료" width={100} height={100} />
        </button>
      </div>
    </div>
  );
}

export default Timer;
