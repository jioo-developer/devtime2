"use client";

import { create } from "zustand";

type TimerState = {
  todoTitle: string;
  savedTodos: string[];
  isTimerRunning: boolean;
  isTimerPaused: boolean;

  setTodoTitle: (todoTitle: string) => void;
  setSavedTodos: (savedTodos: string[]) => void;
  setIsTimerRunning: (isTimerRunning: boolean) => void;
  setIsTimerPaused: (isTimerPaused: boolean) => void;
};

export const useTimerStore = create<TimerState>((set) => ({
  todoTitle: "오늘도 열심히 달려봐요!",
  savedTodos: [],
  isTimerRunning: false,
  isTimerPaused: false,

  setTodoTitle: (todoTitle) => set({ todoTitle }),
  setSavedTodos: (savedTodos) => set({ savedTodos }),
  setIsTimerRunning: (isTimerRunning) => set({ isTimerRunning }),
  setIsTimerPaused: (isTimerPaused) => set({ isTimerPaused }),
}));
