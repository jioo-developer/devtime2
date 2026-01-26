"use client";
import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

interface TimerContextValue {
  isTimerRunning: boolean;
  setIsTimerRunning: Dispatch<SetStateAction<boolean>>;
  savedTitle: string;
  setSavedTitle: Dispatch<SetStateAction<string>>;
  savedTodos: string[];
  setSavedTodos: Dispatch<SetStateAction<string[]>>;
  todoTitle: string;
  setTodoTitle: Dispatch<SetStateAction<string>>;
}

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [savedTitle, setSavedTitle] = useState<string>("");
  const [savedTodos, setSavedTodos] = useState<string[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>("오늘도 열심히 달려봐요!");

  return (
    <TimerContext.Provider
      value={{
        isTimerRunning,
        setIsTimerRunning,
        savedTitle,
        setSavedTitle,
        savedTodos,
        setSavedTodos,
        todoTitle,
        setTodoTitle,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
}
