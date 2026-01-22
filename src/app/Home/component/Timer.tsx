"use client";
import React from "react";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import StartOn from "@/asset/images/Start_on.svg";
import PauseOff from "@/asset/images/Pause_off.svg";
import FinishOff from "@/asset/images/Finish_off.svg";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import styles from "./style.module.css";

type TimerProps = {
    timerId?: string;
    studyLogId?: string;
    startTime?: string;

};

function Timer({ timerId, studyLogId, startTime }: TimerProps = {}) {
    console.log(timerId, studyLogId, startTime);
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
                <CommonButton
                    theme="none"
                    className={styles.startButton}
                    aria-label="시작"
                >
                    <CommonImage src={StartOn} alt="시작" width={100} height={100} />
                </CommonButton>

                <CommonButton
                    theme="none"
                    className={styles.pauseButton}
                    aria-label="일시정지"
                >
                    <CommonImage
                        src={PauseOff}
                        alt="일시정지"
                        width={100}
                        height={100}
                    />
                </CommonButton>

                <CommonButton
                    theme="none"
                    className={styles.finishButton}
                    aria-label="종료"
                >
                    <CommonImage src={FinishOff} alt="종료" width={100} height={100} />
                </CommonButton>
            </div>
        </div>
    );
}

export default Timer;