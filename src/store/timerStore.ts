"use client";

import { create } from "zustand";

type TimerState = {
  todoTitle: string;
  savedTodos: string[];
  isTimerRunning: boolean;
  isTimerPaused: boolean;
  startTime: string; // API 응답 기준(ISO), 타이머 표시용

  setTodoTitle: (todoTitle: string) => void;
  setSavedTodos: (savedTodos: string[]) => void;
  setIsTimerRunning: (isTimerRunning: boolean) => void;
  setIsTimerPaused: (isTimerPaused: boolean) => void;
  setStartTime: (startTime: string) => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  todoTitle: "오늘도 열심히 달려봐요!",
  savedTodos: [],
  isTimerRunning: false,
  isTimerPaused: false,
  startTime: "",

  setTodoTitle: (todoTitle) => set({ todoTitle }),
  setSavedTodos: (savedTodos) => set({ savedTodos }),
  setIsTimerRunning: (isTimerRunning) => set({ isTimerRunning }),
  setIsTimerPaused: (isTimerPaused) => set({ isTimerPaused }),
  setStartTime: (startTime) => set({ startTime }),
}));
