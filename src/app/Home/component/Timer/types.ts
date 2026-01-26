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

export type TimerViewProps = {
  todoTitle: string;
  isTimerRunning: boolean;
  isTimerPaused: boolean;
  hours: string;
  minutes: string;
  seconds: string;
  onStartClick: () => void;
  onPauseClick: () => void;
  onFinishClick: () => void;
  onShowListClick: () => void;
  onResetClick: () => void;
};

