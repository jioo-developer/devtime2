"use client";
import React from "react";
import TodoListForm from "@/app/Home/component/Form/Form";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useModalStore } from "@/store/modalStore";
import { useTimerContext } from "../../../provider/TimerContext";
import { useTimerMutations } from "../../../hooks/mutations/useTimerMutations";
import { calculateSplitTimes, getCurrentSplitTimes } from "../../../utils/calculateSplitTimes";

export function useTimerActions() {
  const openModal = useModalStore.getState().push;
  const closeModal = useModalStore.getState().closeTop;
  const {
    savedTitle,
    savedTodos,
    isTimerPaused,
    setIsTimerRunning,
    setIsTimerPaused,
    setSavedTitle,
    setSavedTodos,
    setTodoTitle,
  } = useTimerContext();

  const { pauseTimerMutation, resumeTimerMutation, resetTimerMutation, finishTimerMutation, updateTasksMutation } =
    useTimerMutations();

  const startTimer = (timerId?: string, startTime?: string, pausedDuration?: number) => {
    // 일시정지 상태면 재개
    if (isTimerPaused && timerId && startTime) {
      const splitTimes = getCurrentSplitTimes(startTime, pausedDuration ?? 0);
      resumeTimerMutation.mutate(
        {
          timerId,
          data: { splitTimes },
        },
        {
          onSuccess: () => {
            setIsTimerPaused(false);
          },
        }
      );
      return;
    }
    openModal({
      width: 640,
      height: 828,
      content: (
        <TodoListForm
          mode="create"
          setTodoTitle={setTodoTitle}
          onTimerStartSuccess={(title, todos) => {
            setSavedTitle(title);
            setSavedTodos(todos);
            setIsTimerRunning(true);
            setIsTimerPaused(false);
          }}
        />
      ),
      showCloseButton: false,
      footer: null,
      BackdropMiss: false,
    });
  };

  const showListTimer = (studyLogId?: string) => {
    openModal({
      width: 640,
      height: 828,
      title: null,
      content: (
        <TodoListForm
          mode="edit"
          initialTitle={savedTitle}
          initialTodos={savedTodos}
          onSave={(title, todos) => {
            if (studyLogId) {
              updateTasksMutation.mutate(
                {
                  studyLogId,
                  data: { tasks: todos },
                },
                {
                  onSuccess: () => {
                    setSavedTitle(title);
                    setSavedTodos(todos);
                    closeModal();
                  },
                  onError: (error) => {
                    console.error("할 일 목록 업데이트 실패:", error);
                    // 에러가 발생해도 로컬 상태는 업데이트
                    setSavedTitle(title);
                    setSavedTodos(todos);
                    closeModal();
                  },
                }
              );
            } else {
              // studyLogId가 없으면 로컬 상태만 업데이트
              setSavedTitle(title);
              setSavedTodos(todos);
              closeModal();
            }
          }}
        />
      ),
      showCloseButton: false,
      footer: null,
      BackdropMiss: false,
    });
  };

  const resetTimer = (timerId?: string) => {
    openModal({
      width: 360,
      title: "기록을 초기화 하시겠습니까?",
      content: "진행되던 타이머 기록은 삭제되고, 복구가 불가능합니다. 계속 초기화할까요?",
      footer: (
        <>
          <CommonButton theme="secondary" onClick={() => closeModal()}>
            취소
          </CommonButton>
          <CommonButton
            theme="primary"
            onClick={() => {
              if (timerId) {
                resetTimerMutation.mutate(timerId, {
                  onSuccess: () => {
                    setIsTimerRunning(false);
                    setIsTimerPaused(false);
                    setSavedTitle("");
                    setSavedTodos([]);
                    setTodoTitle("오늘도 열심히 달려봐요!");
                    closeModal();
                  },
                  onError: (error) => {
                    console.error("타이머 초기화 실패:", error);
                    closeModal();
                  },
                });
              } else {
                // timerId가 없으면 로컬 상태만 초기화
                setIsTimerRunning(false);
                setIsTimerPaused(false);
                setSavedTitle("");
                setSavedTodos([]);
                setTodoTitle("오늘도 열심히 달려봐요!");
                closeModal();
              }
            }}
          >
            초기화하기
          </CommonButton>
        </>
      ),
      showCloseButton: false,
      BackdropMiss: true,
    });
  };

  const finishTimer = (timerId?: string, startTime?: string, studyLogId?: string, pausedDuration?: number) => {
    openModal({
      width: 640,
      height: 828,
      title: null,
      content: (
        <TodoListForm
          mode="end"
          initialTitle={savedTitle}
          initialTodos={savedTodos}
          onEditClick={() => {
            closeModal();
            showListTimer(studyLogId);
          }}
          onFinish={(reflection) => {
            if (timerId && startTime) {
              // splitTimes 계산
              const splitTimes = calculateSplitTimes(startTime, new Date(), pausedDuration ?? 0);

              // 최종 할 일 목록 (완료된 것만 또는 모든 것 - 요구사항 확인 필요)
              // 일단 모든 할 일 목록을 보냄
              const finalTasks = savedTodos;

              finishTimerMutation.mutate(
                {
                  timerId,
                  data: {
                    splitTimes,
                    tasks: finalTasks,
                    reflection: reflection.trim(),
                  },
                },
                {
                  onSuccess: () => {
                    setIsTimerRunning(false);
                    setIsTimerPaused(false);
                    setSavedTitle("");
                    setSavedTodos([]);
                    setTodoTitle("오늘도 열심히 달려봐요!");
                    closeModal();
                  },
                  onError: (error) => {
                    console.error("타이머 종료 실패:", error);
                    closeModal();
                  },
                }
              );
            } else {
              // timerId나 startTime이 없으면 로컬 상태만 초기화
              setIsTimerRunning(false);
              setIsTimerPaused(false);
              setSavedTitle("");
              setSavedTodos([]);
              setTodoTitle("오늘도 열심히 달려봐요!");
              closeModal();
            }
          }}
        />
      ),
      showCloseButton: false,
      footer: null,
      BackdropMiss: false,
    });
  };

  const pauseTimer = (timerId?: string, startTime?: string, pausedDuration?: number) => {
    if (timerId && startTime) {
      // 일시정지 시 즉시 동기화 (splitTimes 포함)
      const splitTimes = getCurrentSplitTimes(startTime, pausedDuration ?? 0);
      pauseTimerMutation.mutate(
        {
          timerId,
          data: { splitTimes },
        },
        {
          onSuccess: () => {
            setIsTimerPaused(true);
          },
          onError: (error) => {
            console.error("타이머 일시정지 실패:", error);
          },
        }
      );
    } else {
      setIsTimerPaused(true);
    }
  };

  return {
    startTimer,
    pauseTimer,
    showListTimer,
    resetTimer,
    finishTimer,
  };
}
