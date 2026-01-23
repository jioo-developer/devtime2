"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import TodoListItem from "@/components/modules/TodoList/ListItem";
import styles from "./style.module.css";
import { useModalStore } from "@/store/modalStore";

type TodoFormData = {
  title: string;
  todoInput: string;
};

export default function TodoListForm() {
  const closeModal = useModalStore((state) => state.closeTop);
  const [todos, setTodos] = useState<string[]>([]);
  const { register, handleSubmit, watch, reset } = useForm<TodoFormData>({
    defaultValues: {
      title: "",
      todoInput: "",
    },
    mode: "onChange",
  });


  const onAddTodo = (data: TodoFormData) => {
    if (data.todoInput.trim()) {
      setTodos([...todos, data.todoInput.trim()]);
      reset({ title: data.title, todoInput: "" });
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

  const { title: titleValue, todoInput: todoInputValue } = watch();

  const canStartTimer =
    titleValue.trim().length > 0 &&
    titleValue.trim().length <= 30 &&
    todos.length >= 1 &&
    todos.every((todo) => todo.trim().length > 0 && todo.trim().length <= 30);

  const handleStartTimer = () => {
    if (!canStartTimer) return;

    console.log("타이머 시작", { title: titleValue.trim(), todos });
    closeModal();
  };

  return (
    <div className={styles.goalForm}>
      <div className={styles.todoSection}>
        <form
          onSubmit={handleSubmit(onAddTodo)}
          className={styles.inputGroup}
        >
          <h3 className={styles.sectionTitle}>오늘의 목표</h3>
          <CommonInput
            id="title"
            type="text"
            placeholder="목표를 입력해 주세요. (최대 30자)"
            register={register}
            style={{ border: 0, borderBottom: "1px solid var(--gray-200)", marginBottom: 36 }}
            validation={{
              required: "목표를 입력해 주세요.",
              maxLength: {
                value: 30,
                message: "최대 30자까지 입력 가능합니다.",
              },
            }}
          />
          <h3 className={styles.sectionTitle}>할일 목록</h3>
          <div className={styles.todoInput}>
            <CommonInput
              id="todoInput"
              type="text"
              placeholder="할 일을 입력해주세요. (최대 30자)"
              register={register}
              style={{ border: 0, borderBottom: "1px solid var(--gray-200)" }}
              validation={{
                maxLength: {
                  value: 30,
                  message: "최대 30자까지 입력 가능합니다.",
                },
              }}
            />
            <CommonButton
              type="button"
              theme="overlap"
              style={{ width: "auto" }}
              disabled={!todoInputValue.trim()}
              onClick={handleSubmit(onAddTodo)}
            >
              추가
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

        <div className={styles.footer}>
          <CommonButton theme="secondary" onClick={() => closeModal()}>
            취소
          </CommonButton>
          <CommonButton
            theme={canStartTimer ? "primary" : "disable"}
            disabled={!canStartTimer}
            onClick={handleStartTimer}
          >
            타이머 시작하기
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
