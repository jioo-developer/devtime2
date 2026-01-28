"use client";
import { useEffect, useRef, useState } from "react";

/**
 * 타이머 표시 계산에 필요한 입력 파라미터
 */
export type UseTimerDisplayParams = {
  /** 타이머가 현재 실행 중인지 여부 */
  isRunning: boolean;

  /** 타이머가 일시정지 상태인지 여부 */
  isPaused: boolean;

  /** 서버 혹은 스토어에 저장된 시작 시각 (ISO 문자열) */
  startTimeISO?: string | null;

  /**
   * 로컬에서 시작한 타이머의 시작 시각(epoch ms)
   * 값이 있으면 서버 시간 대신 이 값을 기준으로 경과 시간을 계산한다.
   */
  clientStartedAtMs?: number | null;

  /**
   * 누적 일시정지 시간(ms)
   * 실제 경과 시간 = 현재 시각 - 기준 시각 - totalPausedDurationMs
   */
  totalPausedDurationMs: number;
};

/**
 * 타이머 경과 시간을 HH:MM:SS 형식으로 계산해주는 표시 전용 훅
 *
 * - 서버 기준 타이머가 있으면 서버 startTime을 기준으로 계산
 * - 로컬에서 시작했으면 clientStartedAtMs를 기준으로 계산
 * - 일시정지 누적 시간을 항상 반영
 * - 실행 중일 때만 interval을 돌려 화면을 갱신
 */
export function useTimerDisplay({
  isRunning,
  isPaused,
  startTimeISO,
  clientStartedAtMs,
  totalPausedDurationMs,
}: UseTimerDisplayParams) {

  // 화면에 표시할 시/분/초 문자열 상태
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  /**
   * 로컬에서 시작한 경우에만 사용하는 "표시 기준 시각"
   *
   * effect가 처음 실행되는 순간의 기준 시각을 고정해두기 위해 ref에 저장한다.
   * (리렌더되어도 값 유지, 재시작 시에만 초기화)
   */
  const localDisplayBaseTimestampRef = useRef<number | null>(null);

  // 로컬 시작 여부 판단
  const isLocalStart = clientStartedAtMs != null;

  // 서버 startTime이 있으면 epoch(ms)로 변환
  const serverStartTimestampMs = startTimeISO
    ? new Date(startTimeISO).getTime()
    : null;

  /**
   * 타이머가 실행 중일 때 1초마다 경과 시간을 계산해 화면에 반영
   */
  useEffect(() => {

    // 실행 중이 아니거나, 일시정지 상태면 interval을 돌리지 않는다.
    // 동시에 로컬 기준 시각도 초기화해 다음 실행 시 새로 잡히게 한다.
    if (!isRunning || isPaused) {
      localDisplayBaseTimestampRef.current = null;
      return;
    }

    // 로컬 시작인 경우: 최초 한 번만 기준 시각을 고정
    if (isLocalStart) {
      if (localDisplayBaseTimestampRef.current === null) {
        localDisplayBaseTimestampRef.current = clientStartedAtMs ?? null;
      }
    }
    // 서버 기준인데 startTime이 없으면 계산 불가
    else if (serverStartTimestampMs == null) {
      return;
    }

    /**
     * 실제 경과 시간 계산의 기준 시각
     *
     * - 로컬 시작: localDisplayBaseTimestampRef (없으면 clientStartedAtMs, 최후엔 Date.now)
     * - 서버 시작: serverStartTimestampMs
     */
    const displayBaseTimestampMs: number = isLocalStart
      ? (
        localDisplayBaseTimestampRef.current ??
        clientStartedAtMs ??
        Date.now()
      )
      : (serverStartTimestampMs as number);

    /**
     * 숫자를 항상 두 자리 문자열로 변환
     * 예: 3 → "03"
     */
    const toTwoDigitString = (value: number) =>
      String(value).padStart(2, "0");

    /**
     * 실제 표시값 업데이트 함수
     */
    const update = () => {

      // 경과 시간(ms) = 현재 시각 - 기준 시각 - 누적 일시정지 시간
      const elapsedMs =
        Date.now() -
        displayBaseTimestampMs -
        totalPausedDurationMs;

      // 초 단위로 변환 (음수 방지)
      const totalSec = Math.max(
        0,
        Math.floor(elapsedMs / 1000)
      );

      // 시 / 분 / 초 분해
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      // 화면 상태 갱신
      setHours(toTwoDigitString(hours));
      setMinutes(toTwoDigitString(minutes));
      setSeconds(toTwoDigitString(seconds));
    };

    // 즉시 한 번 계산 후, 1초 간격으로 반복
    update();
    const intervalId = setInterval(update, 1000);

    // 컴포넌트 언마운트 혹은 조건 변경 시 interval 정리
    return () => clearInterval(intervalId);

  }, [
    isRunning,
    isPaused,
    isLocalStart,
    clientStartedAtMs,
    serverStartTimestampMs,
    totalPausedDurationMs,
  ]);

  /**
   * 외부에서 타이머가 종료/초기화되어 startTime이 비워졌을 때
   * 화면 표시를 00:00:00으로 리셋한다.
   */
  useEffect(() => {
    if (!isRunning && !startTimeISO) {
      setHours("00");
      setMinutes("00");
      setSeconds("00");
      localDisplayBaseTimestampRef.current = null;
    }
  }, [isRunning, startTimeISO]);

  // 화면 및 버튼 상태에 필요한 값 반환
  return {
    hours,
    minutes,
    seconds,

    // UI 제어용 플래그 (표시 훅이 계산해줘도 되는 범위)
    isStartDisabled: isRunning && !isPaused,
    isPauseDisabled: !isRunning || isPaused,
    isFinishDisabled: !isRunning,
  };
}
