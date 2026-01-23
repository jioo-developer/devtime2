"use client";
import Timer from "@/app/Home/component/Timer/Timer";
import { useTimers } from "./hooks/useTimers";
import "./style.css";

export default function Page() {
  const { data: timerData, isLoading } = useTimers();
  // 진행 중 타이머가 있는지 확인
  const hasActiveTimer =
    timerData &&
    timerData.timerId &&
    timerData.studyLogId &&
    timerData.startTime

  return (
    <main className="mainPageWrap">
      <h2 className="motivationalText">오늘도 열심히 달려봐요!</h2>
      {isLoading ? (
        <div>로딩 중...</div>
      ) : hasActiveTimer ? (
        <Timer
          timerId={timerData.timerId}
          studyLogId={timerData.studyLogId}
          startTime={timerData.startTime}
        />
      ) : (
        <Timer />
      )}
    </main>
  );
}
