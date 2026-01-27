"use client";

import { create } from "zustand";

type TimerState = {
  todoTitle: string;
  savedTodos: string[];
  isTimerRunning: boolean;
  isTimerPaused: boolean;
  startTime: string; // API 응답 기준(ISO)
  /** 클라이언트에서 타이머를 실제 시작한 시각(ms). 표시용 */
  clientStartedAt: number | null;
  /** 일시정지 구간 누적(ms). 표시 = elapsed - totalPausedDuration */
  totalPausedDuration: number;

  setTodoTitle: (todoTitle: string) => void;
  setSavedTodos: (savedTodos: string[]) => void;
  setIsTimerRunning: (isTimerRunning: boolean) => void;
  setIsTimerPaused: (isTimerPaused: boolean) => void;
  setStartTime: (startTime: string) => void;
  setClientStartedAt: (at: number | null) => void;
  setTotalPausedDuration: (ms: number | ((prev: number) => number)) => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  todoTitle: "오늘도 열심히 달려봐요!",
  savedTodos: [],
  isTimerRunning: false,
  isTimerPaused: false,
  startTime: "",
  clientStartedAt: null,
  totalPausedDuration: 0,

  setTodoTitle: (todoTitle) => set({ todoTitle }),
  setSavedTodos: (savedTodos) => set({ savedTodos }),
  setIsTimerRunning: (isTimerRunning) => set({ isTimerRunning }),
  setIsTimerPaused: (isTimerPaused) => set({ isTimerPaused }),
  setStartTime: (startTime) => set({ startTime }),
  setClientStartedAt: (clientStartedAt) => set({ clientStartedAt }),
  setTotalPausedDuration: (ms) =>
    set((s) => ({
      totalPausedDuration: typeof ms === "function" ? ms(s.totalPausedDuration) : ms,
    })),
}));
