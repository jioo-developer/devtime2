"use client";
import { UseFormReturn } from "react-hook-form";
import { TodoFormData } from "../../types";
import { TitleInput } from "./items/TitleInput";
import { TodoInputSection } from "./items/TodoInputSection";
import { TodoListSection } from "./items/TodoListSection";
import { FormFooter } from "./items/FormFooter";

interface CreateFormProps {
  form: UseFormReturn<TodoFormData>;
  todos: string[];
  todoInputValue: string;
  handleAddTodo: () => void;
  handleRemoveTodo: (index: number) => void;
  handleTextChange: (index: number) => (nextText: string) => void;
  canStartTimer: boolean;
  onStartTimer: () => void;
}

export function CreateForm({
  form,
  todos,
  todoInputValue,
  handleAddTodo,
  handleRemoveTodo,
  handleTextChange,
  canStartTimer,
  onStartTimer,
}: CreateFormProps) {
  const { register } = form;

  return (
    <div className="goalForm">
      <div className="todoSection">
        <form className="inputGroup">
          <TitleInput mode="create" register={register} />
          <TodoInputSection
            mode="create"
            register={register}
            todoInputValue={todoInputValue}
            onAddTodo={handleAddTodo}
          />
        </form>

        <TodoListSection
          mode="create"
          todos={todos}
          onTextChange={handleTextChange}
          onDelete={handleRemoveTodo}
        />

        <FormFooter
          mode="create"
          canStartTimer={canStartTimer}
          onStartTimer={onStartTimer}
        />
      </div>
    </div>
  );
}
