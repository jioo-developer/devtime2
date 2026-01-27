"use client";
import { UseFormReturn } from "react-hook-form";
import { TodoFormData } from "../../types";
import { TodoInputSection } from "./items/TodoInputSection";
import { TodoListSection } from "./items/TodoListSection";
import { FormFooter } from "./items/FormFooter";

interface EditFormProps {
  form: UseFormReturn<TodoFormData>;
  todos: string[];
  todoInputValue: string;
  handleAddTodo: () => void;
  handleRemoveTodo: (index: number) => void;
  handleTextChange: (index: number) => (nextText: string) => void;
  handleSave: () => void;
}

export function EditForm({
  form,
  todos,
  todoInputValue,
  handleAddTodo,
  handleRemoveTodo,
  handleTextChange,
  handleSave,
}: EditFormProps) {
  const { register } = form;

  return (
    <div className="goalForm">
      <div className="todoSection">
        <form className="inputGroup">
          <TodoInputSection
            mode="edit"
            register={register}
            todoInputValue={todoInputValue}
            onAddTodo={handleAddTodo}
          />
        </form>

        <TodoListSection
          mode="edit"
          todos={todos}
          onTextChange={handleTextChange}
          onDelete={handleRemoveTodo}
        />

        <FormFooter mode="edit" onSave={handleSave} />
      </div>
    </div>
  );
}
