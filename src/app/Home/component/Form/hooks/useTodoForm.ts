import { useState, useEffect, useRef } from "react";
import { UseFormWatch, UseFormReset } from "react-hook-form";
import { TodoFormData } from "../types";

export type TodoItem = { content: string; isCompleted: boolean };

/** resetKey가 바뀌면(예: studyLogId) 외부 initialTodos 동기화 가능 상태로 리셋 */
export function useTodoForm(
  watch: UseFormWatch<TodoFormData>,
  reset: UseFormReset<TodoFormData>,
  initialTodos: TodoItem[] = [],
  resetKey?: string
) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const syncedRef = useRef(false);
  const prevResetKeyRef = useRef(resetKey);
  if (prevResetKeyRef.current !== resetKey) {
    prevResetKeyRef.current = resetKey ?? "";
    syncedRef.current = false;
  }
  useEffect(() => {
    if (initialTodos.length > 0 && !syncedRef.current) {
      syncedRef.current = true;
      setTodos(initialTodos);
    }
  }, [initialTodos]);

  const { todoInput: todoInputValue, title: titleValue } = watch();

  const handleAddTodo = () => {
    const currentTodoInput = todoInputValue?.trim() || "";
    if (currentTodoInput) {
      setTodos([...todos, { content: currentTodoInput, isCompleted: false }]);
      reset({ title: titleValue, todoInput: "" });
    }
  };

  const handleRemoveTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleTextChange = (index: number) => (nextText: string) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = { ...updatedTodos[index], content: nextText };
    setTodos(updatedTodos);
  };

  const handleStatusChange = (index: number) => (isCompleted: boolean) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = { ...updatedTodos[index], isCompleted };
    setTodos(updatedTodos);
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
