import { Dispatch, SetStateAction } from "react";

export interface BaseHandleParams {
  setSavedTitle: Dispatch<SetStateAction<string>>;
  setSavedTodos: Dispatch<SetStateAction<string[]>>;
}

export interface TimerStateParams {
  setIsTimerRunning: Dispatch<SetStateAction<boolean>>;
  setTodoTitle: Dispatch<SetStateAction<string>>;
}

export interface SavedDataParams {
  savedTitle: string;
  savedTodos: string[];
}

