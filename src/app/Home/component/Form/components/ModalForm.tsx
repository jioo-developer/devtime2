"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormMode, TodoFormData } from "../types";
import { useTodoForm } from "../hooks/useTodoForm";
import { isTimerStartValid } from "../utils/timerValidation";
import { TodoListSection } from "./TodoListSection";
import { TodoInputSection } from "./TodoInputSection";
import { FormFooter } from "./FormFooter";
import { CommonTextArea } from "@/components/atoms/CommonTextArea/CommonTextArea";
import { useGetStudyLog } from "@/app/Home/hooks/getter/useGetStudyLog";
import { useTimerStore } from "@/store/timerStore";
import { useModalFormActions } from "../hooks/useModalFormActions";
import { useFinishTimerAction } from "../hooks/useFinishTimerAction";
import "../style.css";

export type ModalFormEndOptions = {
  timerId: string;
  startTime: string;
  pausedDuration?: number;
  endTime?: string;
};

type ModalFormProps = {
  mode: FormMode;
  studyLogId?: string;
  endOptions?: ModalFormEndOptions;
};

export default function ModalForm({ mode, studyLogId, endOptions }: ModalFormProps) {
  const isEndMode = mode === "end";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const { data: studyLog } = useGetStudyLog(
    isEditMode || isEndMode ? studyLogId : undefined
  );
  const savedTodos = useTimerStore((state) => state.savedTodos);

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>({ mode: "onChange" });

  const getInitialTodos = () => {
    if (isEditMode && studyLog?.data?.tasks) return studyLog.data.tasks;
    if (isEndMode) {
      return studyLog?.data?.tasks ?? (savedTodos ?? []).map((content) => ({
        content,
        isCompleted: false,
      }));
    }
    return [];
  };

  const getResetKey = () => {
    if (isEndMode && studyLogId) {
      return `${studyLogId}-${studyLog?.data ? "loaded" : "pending"}`;
    }
    return studyLogId ?? (isEndMode ? "end" : "create");
  };

  const {
    todos,
    todoInputValue,
    handleAddTodo,
    handleRemoveTodo,
    handleTextChange,
    handleStatusChange,
  } = useTodoForm(watch, reset, getInitialTodos(), getResetKey());

  const completedCount = (todos ?? []).filter((todo) => todo.isCompleted).length;
  const canStartTimer =
    isCreateMode &&
    isTimerStartValid(watch("title"), (todos ?? []).map((todo) => todo.content));

  const { startTimerAction, saveTasksAction } = useModalFormActions();
  const { finishTimerAction } = useFinishTimerAction();

  const onStartTimer = () => {
    const title = watch("title");
    startTimerAction(title, todos ?? []);
  };

  const onSave = () => {
    if (!isEditMode || !studyLogId) return;
    const title = watch("title") ?? "";
    saveTasksAction(studyLogId, title, todos ?? []);
  };

  const onFinish = () => {
    handleSubmit((data) => {
      if (isEndMode && endOptions) {
        const tasks = (todos ?? []).map((todo) => ({
          content: todo.content,
          isCompleted: todo.isCompleted,
        }));
        finishTimerAction(endOptions, tasks, data.reflection ?? "", completedCount);
      }
    })();
  };

  useEffect(() => {
    if (isEditMode && studyLog?.data) {
      reset({ title: studyLog.data.todayGoal, todoInput: "" });
    }
  }, [isEditMode, studyLog, reset]);

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
          todos={todos ?? []}
          mode={mode}
          onDelete={!isEndMode ? handleRemoveTodo : undefined}
          onTextChange={!isEndMode ? handleTextChange : undefined}
          onStatusChange={handleStatusChange}
        />

        {isEndMode && (
          <div className="completedCountWrap">
            <span className="completedCountText">
              <span className="completedCountNumber">{completedCount}</span>개
              완료
            </span>
          </div>
        )}

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
