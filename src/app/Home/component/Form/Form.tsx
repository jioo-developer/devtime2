"use client";
import React, { useState } from "react";
import { Path, useForm } from "react-hook-form";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import TodoListItem from "@/components/modules/TodoList/ListItem";
import styles from "./style.module.css";

type TodoFormData = {
  todoInput: string;
};

export interface TodoListFormProps {
  sectionTitle?: string;
  placeholder?: string;
  addButtonText?: string;
  onSubmit?: (todos: string[]) => void;
  initialTodos?: string[];
  showCloseButton?: boolean;
}

export default function TodoListForm({
  sectionTitle = "할일 목록",
  placeholder = "할 일을 추가해 주세요.",
  addButtonText = "추가",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit, // TODO: 모달 footer에서 사용 예정
  initialTodos = [],
}: TodoListFormProps) {
  const [todos, setTodos] = useState<string[]>(initialTodos);
  const { register, handleSubmit, watch, reset } = useForm<TodoFormData>({
    defaultValues: {
      todoInput: "",
    },
  });

  const todoInput = watch("todoInput");

  const onAddTodo = (data: TodoFormData) => {
    if (data.todoInput.trim()) {
      setTodos([...todos, data.todoInput.trim()]);
      reset();
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

  return (
    <div className={styles.goalForm}>
      <div className={styles.todoSection}>
        <form
          onSubmit={handleSubmit(onAddTodo)}
          className={styles.inputGroup}
        >
          <CommonInput
            id={sectionTitle as Path<TodoFormData>}
            placeholder={placeholder}
            register={register}
            style={{ border: 0, marginBottom: 36 }}
          />
          <h3 className={styles.sectionTitle}>{sectionTitle}</h3>
          <div className={styles.todoInput}>
            <CommonInput
              id="todoInput"
              type="text"
              placeholder={placeholder}
              register={register}
              style={{ border: 0, borderBottom: "1px solid var(--gray-200)" }}
            />
            <CommonButton
              type="button"
              theme="overlap"
              style={{ width: "auto" }}
              disabled={!todoInput?.trim()}
              onClick={handleSubmit(onAddTodo)}
            >
              {addButtonText}
            </CommonButton>
          </div>
        </form>

        {todos.length > 0 && (
          <div className={styles.todoList}>
            {todos.map((todo, index) => (
              <TodoListItem
                key={index}
                text={todo}
                onTextChange={handleTextChange(index)}
                onDelete={() => handleRemoveTodo(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
