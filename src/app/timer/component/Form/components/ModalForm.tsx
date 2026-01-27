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
import { useGetStudyLog } from "@/app/timer/hooks/getter/useGetStudyLog";
import { useStartTimer } from "@/app/timer/hooks/mutations/useStartTimer";
import { useFinishTimer } from "@/app/timer/hooks/mutations/useFinishTimer";
import { useUpdateStudyLogTasks } from "@/app/timer/hooks/mutations/useUpdateStudyLog";
import { useModalStore } from "@/store/modalStore";
import { useTimerStore } from "@/store/timerStore";
import { buildSplitTimesForStop } from "@/app/timer/utils/calculateSplitTimes";
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

  const { data: studyLog } = useGetStudyLog(
    isEditMode || isEndMode ? studyLogId : undefined
  );
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
        ? (studyLog?.data?.tasks ?? (savedTodos ?? []).map((c) => ({ content: c, isCompleted: false })))
        : [];
  // end 모드에서 studyLog 로드 후 할 일 목록이 바뀌면 useTodoForm이 다시 동기화하도록 key 보강
  const resetKey =
    isEndMode && studyLogId
      ? `${studyLogId}-${studyLog?.data ? "loaded" : "pending"}`
      : studyLogId ?? (isEndMode ? "end" : "create");
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
        /** 서버는 date를 구간 시작 시각으로 해석. timeSpent는 초(seconds). 합=allowedSec, safeSec 캡 적용 */
        const splitTimes = buildSplitTimesForStop(startTime, endTime, pausedDuration);
        const rawRangeMs = Math.max(0, endTime.getTime() - new Date(startTime).getTime() - pausedDuration);
        const allowedSec = Math.floor(rawRangeMs / 1000);
        const BUFFER_SEC = 10;
        const safeSec = Math.max(0, allowedSec - BUFFER_SEC);

        // 서버 end 기준 차이 대비해 합계를 safeSec 이하로 (뒤에서부터 감소)
        const payloadSplitTimes = splitTimes.map((s) => ({ date: s.date, timeSpent: s.timeSpent }));
        let toDeduct = payloadSplitTimes.reduce((a, s) => a + s.timeSpent, 0) - safeSec;
        for (let i = payloadSplitTimes.length - 1; i >= 0 && toDeduct > 0; i--) {
          const take = Math.min(payloadSplitTimes[i].timeSpent, toDeduct);
          payloadSplitTimes[i].timeSpent -= take;
          toDeduct -= take;
        }

        finishTimer(
          {
            timerId,
            data: {
              splitTimes: payloadSplitTimes,
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
              setTodoTitle("오늘도 열심히 달려봐요!");
              setSavedTodos([]);
              closeTop();
            },
            onError: (err) => {
              console.error("공부 완료 처리 실패:", err);
            },
          }
        );
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
