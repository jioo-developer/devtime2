"use client";
import React from "react";
import TodoListForm from "@/app/Home/component/Form/Form";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useModalStore } from "@/store/modalStore";
import { useTimerContext } from "../../../provider/TimerContext";
import { usePauseTimer } from "../../../hooks/usePauseTimer";
import { useResumeTimer } from "../../../hooks/useResumeTimer";
import { useResetTimer } from "../../../hooks/useResetTimer";

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

  const pauseTimerMutation = usePauseTimer();
  const resumeTimerMutation = useResumeTimer();
  const resetTimerMutation = useResetTimer();

  const startTimer = (timerId?: string) => {
    // 일시정지 상태면 재개
    if (isTimerPaused && timerId) {
      resumeTimerMutation.mutate(timerId, {
        onSuccess: () => {
          setIsTimerPaused(false);
        },
      });
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

  const showListTimer = () => {
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
            setSavedTitle(title);
            setSavedTodos(todos);
            closeModal();
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

  const finishTimer = () => {
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
            showListTimer();
          }}
          onFinish={(reflection, completedTodos) => {
            console.log("공부 완료", { reflection, completedTodos });
            // TODO: API 호출로 데이터 저장
            setIsTimerRunning(false);
            setIsTimerPaused(false);
            setSavedTitle("");
            setSavedTodos([]);
            setTodoTitle("오늘도 열심히 달려봐요!");
            closeModal();
          }}
        />
      ),
      showCloseButton: false,
      footer: null,
      BackdropMiss: false,
    });
  };

  const pauseTimer = (timerId?: string) => {
    if (timerId) {
      pauseTimerMutation.mutate(timerId, {
        onSuccess: () => {
          setIsTimerPaused(true);
        },
        onError: (error) => {
          console.error("타이머 일시정지 실패:", error);
        },
      });
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
