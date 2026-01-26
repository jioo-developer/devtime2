import { useState } from "react";
import { UseFormWatch, UseFormReset } from "react-hook-form";
import { TodoFormData } from "../types";

export function useTodoForm(
  watch: UseFormWatch<TodoFormData>,
  reset: UseFormReset<TodoFormData>,
  initialTodos: string[] = []
) {
  const [todos, setTodos] = useState<string[]>(initialTodos);
  const { todoInput: todoInputValue, title: titleValue } = watch();

  const handleAddTodo = () => {
    const currentTodoInput = todoInputValue?.trim() || "";
    if (currentTodoInput) {
      setTodos([...todos, currentTodoInput]);
      reset({ title: titleValue, todoInput: "" });
    }
  };

  const handleRemoveTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleTextChange = (index: number) => (nextText: string) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = nextText;
    setTodos(updatedTodos);
  };

  return {
    todos,
    todoInputValue,
    handleAddTodo,
    handleRemoveTodo,
    handleTextChange,
  };
}
