"use client";

import { useTimerContext } from "@/app/timer/provider/TimerContext";
import TodoListForm from "../FormContainer";
import type { CreateModeProps } from "../types";

/**
 * 타이머 시작 모달에 넣을 Form 용 props.
 * Form/create 모드에 "무엇이 들어가는지"는 이 파일만 보면 된다.
 */
export function CreateFormModalContent() {
  const { setTodoTitle, setSavedTodos, setIsTimerRunning, setIsTimerPaused } = useTimerContext();

  const props: CreateModeProps = {
    mode: "create",
    setTodoTitle,
    onTimerStartSuccess: (title, todos) => {
      setTodoTitle(title);
      setSavedTodos(todos);
      setIsTimerRunning(true);
      setIsTimerPaused(false);
    },
  };

  return <TodoListForm {...props} />;
}
