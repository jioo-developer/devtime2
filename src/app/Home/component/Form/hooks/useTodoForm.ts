import { useEffect, useRef, useState } from "react";
import type { UseFormReset, UseFormWatch } from "react-hook-form";
import type { TodoFormData } from "../types";

export type TodoItem = {
  content: string;
  isCompleted: boolean;
};

type UseTodoFormParams = {
  watch: UseFormWatch<TodoFormData>;
  reset: UseFormReset<TodoFormData>;
  initialTodos?: TodoItem[];
  /** 예: studyLogId. 값이 바뀌면 initialTodos를 다시 동기화할 기회를 1회 허용 */
  resetKey?: string;
};

/**
 * Todo 폼 로직
 * - RHF의 watch/reset을 사용해 입력값과 todo 리스트를 연결
 * - initialTodos는 "resetKey가 변경된 직후"에 한 번만 todos에 동기화한다.
 */
export function useTodoForm({
  watch,
  reset,
  initialTodos = [],
  resetKey,
}: UseTodoFormParams) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  /**
   * 초기 동기화 정책:
   * - resetKey가 바뀌면 "외부 initialTodos를 todos에 다시 반영할 수 있는 상태"로 리셋
   * - 그 다음 effect에서 initialTodos가 들어오면 1회만 반영
   */
  const hasSyncedInitialTodosRef = useRef(false);
  const lastResetKeyRef = useRef<string | undefined>(resetKey);

  // resetKey 변경 감지: effect에서 처리(렌더 중 부작용 방지)
  useEffect(() => {
    if (lastResetKeyRef.current !== resetKey) {
      lastResetKeyRef.current = resetKey;
      hasSyncedInitialTodosRef.current = false;
    }
  }, [resetKey]);

  // initialTodos -> todos 동기화(조건부 1회)
  useEffect(() => {
    if (hasSyncedInitialTodosRef.current) return;
    if (initialTodos.length === 0) return;

    hasSyncedInitialTodosRef.current = true;
    setTodos(initialTodos);
  }, [initialTodos]);

  /**
   * watch()를 매 렌더마다 호출해 최신 입력값을 쓴다.
   * (의존성을 [watch]만 두면 입력이 바뀌어도 갱신되지 않아 추가 버튼이 동작하지 않음)
   */
  const formValues = watch();
  const todoInputValue = formValues?.todoInput ?? "";
  const titleValue = formValues?.title ?? "";

  const handleAddTodo = () => {
    const nextContent = todoInputValue.trim();
    if (!nextContent) return;

    setTodos((prev) => [...prev, { content: nextContent, isCompleted: false }]);

    // 입력값만 비우고 title은 유지
    reset({ title: titleValue, todoInput: "" });
  };

  const handleRemoveTodo = (index: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTextChange = (index: number) => (nextText: string) => {
    setTodos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], content: nextText };
      return next;
    });
  };

  const handleStatusChange = (index: number) => (isCompleted: boolean) => {
    setTodos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isCompleted };
      return next;
    });
  };

  return {
    todos,
    todoInputValue,
    handleAddTodo,
    handleRemoveTodo,
    handleTextChange,
    handleStatusChange,
  };
}
