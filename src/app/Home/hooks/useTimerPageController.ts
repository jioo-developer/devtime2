"use client";
import { useShallow } from "zustand/react/shallow";
import { useTimerStore } from "@/store/timerStore";
import { useIsLoggedIn } from "./useIsLoggedIn";
import { useGetTimers } from "./getter/useGetTimers";
import { useGetStudyLog } from "./getter/useGetStudyLog";
import { useRestoreTimerState } from "./timer/useRestoreTimerState";
import { useRestoreTodosFromStudyLog } from "./timer/useRestoreTodosFromStudyLog";
import { useTimerDisplay } from "./timer/useTimerDisplay";
import { useTimerControls } from "./timer/useTimerControls";
import { useResetTimerAction } from "./mutations/resetTimer/useResetTimer";
import { useTimerModal } from "./timer/useTimerModal";

/**
 * 타이머 페이지의 데이터·복구·표시·핸들러를 한데 모아주는 컨트롤러 훅.
 * 페이지 컴포넌트는 이 훅과 useLoginRequiredModal만 쓰고, UI 조립만 담당한다.
 */
export function useTimerPageController() {
  // ——— 로그인 여부 (getTimers 활성화·useLoginRequiredModal에 전달용) ———
  const { isLoggedIn, isReady } = useIsLoggedIn();

  // ——— 타이머 스토어 (로컬 상태) ———
  // running/paused, 시작 시각, 일시정지 누적 등 — useShallow로 필요한 값만 구독
  const {
    todoTitle,
    isTimerRunning,
    isTimerPaused,
    startTime,
    clientStartedAt,
    totalPausedDuration,
  } = useTimerStore(
    useShallow((state) => ({
      todoTitle: state.todoTitle,
      isTimerRunning: state.isTimerRunning,
      isTimerPaused: state.isTimerPaused,
      startTime: state.startTime,
      clientStartedAt: state.clientStartedAt,
      totalPausedDuration: state.totalPausedDuration,
    }))
  );

  // ——— 서버 데이터 ———
  // 타이머 목록(진행 중 타이머) → 그 타이머의 스터디로그(투두 제목·목록)
  const { data: timerData } = useGetTimers(isLoggedIn);
  const { data: studyLogData } = useGetStudyLog(timerData?.studyLogId);

  // ——— 복구 ———
  // timerData 있으면 running/paused/pausedDuration 세팅, studyLogData 있으면 todoTitle·savedTodos 세팅
  useRestoreTimerState(timerData);
  useRestoreTodosFromStudyLog(studyLogData);

  // ——— 모달·리셋·컨트롤 ———
  // openTimerModal: 시작/종료/수정 모달 열기 | resetTimer: 초기화 확인 모달 → API·스토어 리셋 | controls: 일시정지/재개/종료/리셋 액션
  const { openTimerModal } = useTimerModal();
  const { resetTimer } = useResetTimerAction();
  const controls = useTimerControls();

  // ——— 표시용 기준 시각 ———
  // 서버 startTime 우선, 없으면 스토어 startTime (HH:MM:SS 계산용)
  const startTimeISO = timerData?.startTime ?? startTime ?? null;

  // ——— 디스플레이 (HH:MM:SS + 버튼 disabled 플래그) ———
  const display = useTimerDisplay({
    isRunning: isTimerRunning,
    isPaused: isTimerPaused,
    startTimeISO,
    clientStartedAtMs: clientStartedAt,
    totalPausedDurationMs: totalPausedDuration,
  });

  // ——— 핸들러 (TimerControls에 그대로 내려줌) ———

  // 시작 버튼: 일시정지 중이면 재개, 아니면 "시작" 모달(create) 오픈
  const handleStartOrResume = () => {
    if (isTimerPaused) {
      controls.onResume();
      return;
    }
    openTimerModal("create");
  };

  // 종료 버튼: 스토어에서 running 끄고 → "종료" 모달(end)에 timerId/startTime/pausedDuration 넘겨서 오픈
  const handleFinish = () => {
    if (!timerData?.timerId || !startTimeISO) return;

    controls.onFinish();

    openTimerModal("end", timerData.studyLogId, {
      timerId: timerData.timerId,
      startTime: startTimeISO,
      pausedDuration: totalPausedDuration,
    });
  };

  // 할일 목록 버튼: "수정" 모달(edit) 오픈
  const handleOpenEdit = () => openTimerModal("edit", timerData?.studyLogId);

  // 초기화 버튼: 확인 모달 띄우고 확정 시 API 호출 + 스토어 리셋
  const handleReset = () => resetTimer(timerData?.timerId);

  return {
    isLoggedIn,
    isReady,
    todoTitle,
    isTimerRunning,
    isTimerPaused,
    display,
    handlers: {
      onStartOrResume: handleStartOrResume,
      onPause: controls.onPause,
      onFinish: handleFinish,
      onOpenEdit: handleOpenEdit,
      onReset: handleReset,
    },
  };
}
