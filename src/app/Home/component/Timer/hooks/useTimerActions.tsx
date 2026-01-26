"use client";
import React from "react";
import TodoListForm from "@/app/Home/component/Form/Form";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useModalStore } from "@/store/modalStore";
import { useTimerContext } from "../../../provider/TimerContext";

export function useTimerActions() {
  const openModal = useModalStore.getState().push;
  const closeModal = useModalStore.getState().closeTop;
  const {
    savedTitle,
    savedTodos,
    setIsTimerRunning,
    setSavedTitle,
    setSavedTodos,
    setTodoTitle,
  } = useTimerContext();

  const startTimer = () => {
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
      BackdropMiss: true,
    });
  };

  const resetTimer = () => {
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
              setIsTimerRunning(false);
              setSavedTitle("");
              setSavedTodos([]);
              setTodoTitle("오늘도 열심히 달려봐요!");
              closeModal();
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

  return {
    startTimer,
    showListTimer,
    resetTimer,
    finishTimer,
  };
}
