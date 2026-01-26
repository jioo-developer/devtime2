"use client";
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { TodoFormData } from "../../types";
import { TodoListSection } from "./items/TodoListSection";
import { ReflectionSection } from "./items/ReflectionSection";
import { FormFooter } from "./items/FormFooter";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import styles from "./EndForm.module.css";

interface EndFormProps {
  mode: "end" | "reset";
  onEditClick: () => void;
  form: UseFormReturn<TodoFormData>;
  todos: string[];
  todoInputValue: string;
  initialTodos: string[];
  handleAddTodo: () => void;
  handleRemoveTodo: (index: number) => void;
  handleTextChange: (index: number) => (nextText: string) => void;
  onFinish?: (reflection: string, completedTodos: boolean[]) => void;
  onReset?: () => void;
}

export function EndForm({
  mode,
  onEditClick,
  form,
  todos,
  todoInputValue,
  initialTodos,
  handleAddTodo,
  handleRemoveTodo,
  handleTextChange,
  onFinish,
  onReset,
}: EndFormProps) {
  const { register, handleSubmit } = form;
  const [completedTodos, setCompletedTodos] = useState<boolean[]>(
    initialTodos.map(() => false)
  );

  useEffect(() => {
    setCompletedTodos(initialTodos.map(() => false));
  }, [initialTodos]);

  const onFinishValid = (data: TodoFormData) => {
    if (mode === "end" && onFinish) {
      onFinish(data.reflection?.trim() ?? "", completedTodos);
    } else if (mode === "reset" && onReset) {
      onReset();
    }
  };

  return (
    <div className="goalForm">
      <div className="todoSection">
        <div className={styles.headerSection}>
          <h2 className={styles.headerTitle}>
            {mode === "reset" ? "기록을 초기화 하시겠습니까?" : "오늘도 수고하셨어요!"}
          </h2>
          <p className={styles.headerDescription}>
            {mode === "reset"
              ? "진행되던 타이머 기록은 삭제되고, 복구가 불가능합니다. 계속 초기화할까요?"
              : "완료한 일을 체크하고, 오늘의 학습 회고를 작성해 주세요."}
          </p>
        </div>

        <form className="inputGroup">
          <div className={`todoInput ${styles.todoInputWrapper}`}>
            <CommonInput
              id="todoInput"
              type="text"
              placeholder="할 일을 추가해 주세요."
              register={register}
              className={styles.inputNoBorder}
              validation={{
                maxLength: {
                  value: 30,
                  message: "최대 30자까지 입력 가능합니다.",
                },
              }}
            />
            <CommonButton
              type="button"
              theme="none"
              className={`${styles.addButton} ${todoInputValue.trim() ? styles.addButtonEnabled : styles.addButtonDisabled}`}
              disabled={!todoInputValue.trim()}
              onClick={handleAddTodo}
            >
              추가
            </CommonButton>
          </div>
        </form>

        {mode === "end" && (
          <>
            <TodoListSection
              mode="end"
              todos={todos}
              completedTodos={completedTodos}
              onCompletedChange={setCompletedTodos}
              onEditClick={onEditClick}
              onTextChange={handleTextChange}
              onDelete={handleRemoveTodo}
            />

            <form className="inputGroup">
              <ReflectionSection register={register} />
            </form>
          </>
        )}

        <FormFooter mode={mode} onFinish={mode === "end" ? handleSubmit(onFinishValid) : undefined} onReset={mode === "reset" ? onReset : undefined} />
      </div>
    </div>
  );
}
