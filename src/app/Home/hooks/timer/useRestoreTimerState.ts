"use client";
import { useEffect, useRef } from "react";
import type { TimerResponse } from "../getter/useGetTimers";
import { useTimerStore } from "@/store/timerStore";
import { useShallow } from "zustand/react/shallow";

/**
 * 타이머 복구(restore) 훅
 *
 * 목적:
 * - 서버에서 내려온 timerData가 "진행 중인 타이머"를 의미한다면
 *   timerStore의 실행 상태(isTimerRunning/isTimerPaused/totalPausedDuration)를 복구한다.
 *
 * 범위:
 * - "타이머 상태"만 다룬다.
 * - 투두/스터디로그(todoTitle, savedTodos 등)는 이 훅에서 다루지 않는다.
 */
export function useRestoreTimerState(timerData: TimerResponse | undefined) {
  /**
   * 마지막으로 복구한 타이머를 식별하기 위한 ref
   * - 같은 timerKey로 effect가 여러 번 실행되어도
   *   "새 타이머인지 / 동일 타이머의 재실행인지"를 구분할 수 있게 해준다.
   */
  const restoredTimerKeyRef = useRef<string | null>(null);

  /**
   * 현재 서버 타이머를 식별하는 키
   * - timerId + startTime을 조합해서 "이 타이머가 동일한 타이머인지" 판별한다.
   * - timerData가 없거나 필드가 부족하면 null (복구할 타이머가 없음)
   */
  const timerKey =
    timerData?.timerId && timerData?.startTime
      ? `${timerData.timerId}:${timerData.startTime}`
      : null;

  /**
   * store 액션만 한 번에 가져온다.
   * - 액션만 필요하므로 selector로 필요한 메서드만 뽑는다.
   * - useShallow로 객체 비교 시 불필요한 리렌더를 방지한다.
   */
  const { setIsTimerRunning, setIsTimerPaused, setTotalPausedDuration } =
    useTimerStore(
      useShallow((state) => ({
        setIsTimerRunning: state.setIsTimerRunning,
        setIsTimerPaused: state.setIsTimerPaused,
        setTotalPausedDuration: state.setTotalPausedDuration,
      }))
    );

  useEffect(() => {
    /**
     * 서버에 "진행 중인 타이머"가 없다면
     * - 타이머는 완전히 꺼진 상태로 정리한다.
     * - 다음에 타이머가 생겼을 때를 대비해 restoredTimerKeyRef도 초기화한다.
     */
    if (!timerKey) {
      setIsTimerRunning(false);
      setIsTimerPaused(false);
      restoredTimerKeyRef.current = null;
      return;
    }

    /**
     * 새 타이머이거나, 페이지 복구(재마운트/재진입)로 인해
     * 동일한 타이머 정보를 다시 받는 경우인지 판별한다.
     *
     * - restoredTimerKeyRef.current !== timerKey
     *   => "복구 대상이 바뀌었다" 또는 "처음 복구하는 타이머다"
     */
    const isNewTimerOrPageRestore = restoredTimerKeyRef.current !== timerKey;

    // 현재 타이머를 "이미 복구 처리한 키"로 기록
    restoredTimerKeyRef.current = timerKey;

    /**
     * 서버에 진행 중인 타이머가 있다는 뜻이므로 running 상태를 true로 둔다.
     * (이 훅은 '진행 중 타이머가 존재하면 running=true'라는 정책을 갖는다.)
     */
    setIsTimerRunning(true);

    /**
     * 새 타이머 / 페이지 복구 상황에서는
     * - paused를 풀고
     * - 누적 일시정지 시간을 0으로 초기화한다.
     *
     * 의도:
     * - "표시/컨트롤 로직"이 예측 가능한 초기 상태에서 시작하도록 만들기 위함.
     * - (정확한 paused/pausedDuration을 서버에서 내려받는 구조라면,
     *    여기 정책은 스펙에 맞춰 변경되어야 한다.)
     */
    if (isNewTimerOrPageRestore) {
      setIsTimerPaused(false);
      setTotalPausedDuration(0);
    }
  }, [timerKey, setIsTimerRunning, setIsTimerPaused, setTotalPausedDuration]);
}
