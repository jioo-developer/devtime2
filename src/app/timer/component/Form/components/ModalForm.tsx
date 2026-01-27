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
import { useGetStudyLog } from "@/app/timer/hooks/useGetStudyLog";
import { useStartTimer } from "@/app/timer/hooks/useStartTimer";
import { useFinishTimer } from "@/app/timer/hooks/useFinishTimer";
import { useUpdateStudyLogTasks } from "@/app/timer/hooks/useUpdateStudyLog";
import { useModalStore } from "@/store/modalStore";
import { useTimerStore } from "@/store/timerStore";
import {
  calculateSplitTimes,
} from "@/app/timer/utils/calculateSplitTimes";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import "../style.css";

/** mode가 "end"일 때만 전달하는 값 (완료 API 호출용) */
export type ModalFormEndOptions = {
  timerId: string;
  startTime: string;
  pausedDuration?: number;
  /** 타이머 종료 시각(모달 열린 순간). 없으면 제출 시각 사용 */
  endTime?: string;
};

type ModalFormProps = {
  mode: FormMode;
  studyLogId?: string;
  endOptions?: ModalFormEndOptions;
};

export default function ModalForm({
  mode,
  studyLogId,
  endOptions,
}: ModalFormProps) {
  const isEndMode = mode === "end";
  const isEditMode = mode === "edit";

  const { data: studyLog } = useGetStudyLog(isEditMode ? studyLogId : undefined);
  const savedTodos = useTimerStore((state) => state.savedTodos);
  const setTodoTitle = useTimerStore((state) => state.setTodoTitle);
  const setSavedTodos = useTimerStore((state) => state.setSavedTodos);

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoFormData>({ mode: "onChange" });

  const initialTodos =
    isEditMode && studyLog?.data?.tasks
      ? studyLog.data.tasks
      : isEndMode
        ? (savedTodos ?? []).map((c) => ({ content: c, isCompleted: false }))
        : [];
  const resetKey = studyLogId ?? (isEndMode ? "end" : "create");
  const {
    todos,
    todoInputValue,
    handleAddTodo,
    handleRemoveTodo,
    handleTextChange,
    handleStatusChange,
  } = useTodoForm(watch, reset, initialTodos, resetKey);

  const listTodos = todos ?? [];
  const completedCount = listTodos.filter((t) => t.isCompleted).length;

  const canStartTimer =
    mode === "create" &&
    isTimerStartValid(watch("title"), (todos ?? []).map((t) => t.content));

  const { mutate: startTimer } = useStartTimer();
  const { mutate: finishTimer } = useFinishTimer();
  const { mutate: updateStudyLogTasks } = useUpdateStudyLogTasks();
  const openModal = useModalStore((state) => state.push);
  const closeTop = useModalStore((state) => state.closeTop);
  const {
    setIsTimerRunning,
    setIsTimerPaused,
    setStartTime,
    setClientStartedAt,
    setTotalPausedDuration,
    setTimerEndedAt,
  } = useTimerStore.getState();

  const onStartTimer = () => {
    const title = watch("title");
    if (!title) return;
    startTimer({
      todayGoal: title,
      tasks: (todos ?? []).map((t) => t.content),
    });
  };
  const onSave = () => {
    if (!isEditMode || !studyLogId) return;
    const title = watch("title") ?? "";
    const taskList = (todos ?? []).map((t) => ({
      content: t.content,
      isCompleted: t.isCompleted,
    }));
    updateStudyLogTasks(
      { studyLogId, tasks: taskList },
      {
        onSuccess: () => {
          setTodoTitle(title);
          setSavedTodos((todos ?? []).map((t) => t.content));
          closeTop();
        },
        onError: (err) => {
          console.error("할 일 목록 저장 실패:", err);
        },
      }
    );
  };
  const onFinish = () => {
    handleSubmit((data) => {
      if (isEndMode && endOptions) {
        if (completedCount === 0) {
          openModal({
            width: 360,
            title: "알림",
            content: (
              <>
                완료한 일이 없습니다.
                <br />
                할일 목록을 다시 한번 확인해주시겠어요?
              </>
            ),
            showCloseButton: false,
            BackdropMiss: true,
            footer: (
              <CommonButton theme="primary" onClick={() => closeTop()}>
                확인
              </CommonButton>
            ),
          });
          return;
        }
        const {
          timerId,
          startTime,
          pausedDuration = 0,
          endTime: endTimeFromProps,
        } = endOptions;
        /** 모달 열린 시각 고정. props 말고 스토어도 보면 클로저 누락 시에도 동작 */
        const endTimeStr = endTimeFromProps ?? useTimerStore.getState().timerEndedAt;
        const endTime = endTimeStr ? new Date(endTimeStr) : new Date();
        const splitTimesMs = calculateSplitTimes(
          startTime,
          endTime,
          pausedDuration
        );
        const startMs = new Date(startTime).getTime();
        const endMs = endTime.getTime();
        const expectedStudyMs = Math.max(
          0,
          endMs - startMs - pausedDuration
        );
        /** 서버는 (요청 수신 시각−시작−일시정지) 기준 검사. 여유 2초 빼서 400 방지 */
        const allowedSec = Math.max(0, Math.floor(expectedStudyMs / 1000) - 2);

        /** API는 timeSpent를 초(seconds) 단위로 기대. 개별은 floor 후 합이 allowedSec 초과 시 뒤에서 부터 깎음 */
        const splitTimes = splitTimesMs.map((s) => ({
          date: s.date,
          timeSpent: Math.floor(s.timeSpent / 1000),
        }));
        const totalSentSec = splitTimes.reduce((acc, s) => acc + s.timeSpent, 0);
        if (totalSentSec > allowedSec) {
          let diff = totalSentSec - allowedSec;
          for (let i = splitTimes.length - 1; i >= 0 && diff > 0; i--) {
            const deduct = Math.min(splitTimes[i].timeSpent, diff);
            splitTimes[i].timeSpent -= deduct;
            diff -= deduct;
          }
        }

        if (process.env.NODE_ENV === "development") {
          console.group("[Finish Timer 디버깅]");
          console.log("startTime", startTime, "endTime", endTimeStr ?? "(제출 시각)");
          console.log("pausedDuration (ms)", pausedDuration, "→ allowedSec", allowedSec);
          console.log("splitTimes 전송", splitTimes, "총(timeSpent 초)", splitTimes.reduce((a, s) => a + s.timeSpent, 0));
          console.groupEnd();
        }

        finishTimer(
          {
            timerId,
            data: {
              splitTimes,
              tasks: listTodos.map((t) => ({
                content: t.content,
                isCompleted: t.isCompleted,
              })),
              review: data.reflection ?? "",
            },
          },
          {
            onSuccess: () => {
              setIsTimerRunning(false);
              setIsTimerPaused(false);
              setStartTime("");
              setClientStartedAt(null);
              setTotalPausedDuration(0);
              setTimerEndedAt(null);
              closeTop();
            },
            onError: (err) => {
              console.error("공부 완료 처리 실패:", err);
            },
          }
        );
      } else {
        console.log(data);
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
          todos={listTodos}
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
