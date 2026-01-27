"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormMode, TodoFormData } from "../types";
import { useTodoForm } from "../hooks/useTodoForm";
import { isTimerStartValid } from "../utils/timerValidation";
import { TodoListSection } from "./TodoListSection";
import { TodoInputSection } from "./TodoInputSection";
import { FormFooter } from "./FormFooter";
import { CommonTextArea } from "@/components/atoms/CommonTextArea/CommonTextArea";
import { useStartTimer } from "@/app/timer/hooks/useStartTimer";
import { useModalStore } from "@/store/modalStore";
import { useTimerStore } from "@/store/timerStore";
import "../style.css";

export default function ModalForm({ mode }: { mode: FormMode }) {
  const isEndMode = mode === "end";

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>({ mode: "onChange" });

  const {
    todos,
    todoInputValue,
    handleAddTodo,
    handleRemoveTodo,
    handleTextChange,
  } = useTodoForm(watch, reset, []);

  const canStartTimer =
    mode === "create" && isTimerStartValid(watch("title"), todos);

  const closeTop = useModalStore((state) => state.closeTop);
  const { setTodoTitle, setSavedTodos, setIsTimerRunning } = useTimerStore.getState();
  const { mutate: startTimer } = useStartTimer();

  const onStartTimer = () => {
    const title = watch("title");
    if (title) {
      startTimer(
        { todayGoal: title, tasks: [...todos] },
        {
          onSuccess: () => {
            setTodoTitle(title);
            setSavedTodos(todos);
            setIsTimerRunning(true);
            closeTop();
          },
          onError: (error) => {
            if (error.message.includes("409")) {
              closeTop();
            }
          },
        },
      );
    }
  };
  const onSave = () => {
    // TODO: 저장 API 연동
  };
  const onFinish = () => {
    handleSubmit((data) => {
      console.log(data);
      // TODO: 공부 완료 API 연동 (data.reflection, completedTodos 등)
    })();
  };

  return (
    <div className="goalForm">
      <div className="todoSection">
        {isEndMode && (
          <div>
            <h2 className="headerTitle">오늘도 수고하셨어요!</h2>
            <p className="headerDescription">
              완료한 일을 체크하고, 오늘의 학습 회고를 작성해 주세요.
            </p>
          </div>
        )}

        {!isEndMode && (
          <TodoInputSection
            register={register}
            mode={mode}
            todoInputValue={todoInputValue}
            onAddTodo={handleAddTodo}
          />
        )}

        <TodoListSection
          todos={todos}
          onDelete={!isEndMode ? handleRemoveTodo : undefined}
          onTextChange={!isEndMode ? handleTextChange : undefined}
        />

        {isEndMode && (
          <div className="reflectionContainer">
            <h3 className="sectionTitle">학습 회고</h3>
            <CommonTextArea
              rows={8}
              {...register("reflection", {
                required: "학습 회고를 작성해 주세요.",
                minLength: { value: 15, message: "15자 이상 작성해 주세요." },
                maxLength: { value: 500, message: "500자 이하로 작성해 주세요." },
              })}
              placeholder="오늘 학습한 내용을 회고해 보세요. (15자 이상 작성 필수)"
              className="reflectionTextarea"
              error={errors.reflection?.message}
            />
          </div>
        )}

        <FormFooter
          mode={mode}
          canStartTimer={canStartTimer}
          onStartTimer={onStartTimer}
          onSave={onSave}
          onFinish={onFinish}
        />
      </div>
    </div>
  );
}
