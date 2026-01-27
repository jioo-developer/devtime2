"use client";

import { useTimerContext } from "@/app/timer/provider/TimerContext";
import { useTimerMutations } from "@/app/timer/hooks/mutations";
import { useModalStore } from "@/store/modalStore";
import { calculateSplitTimes } from "@/app/timer/utils/calculateSplitTimes";
import TodoListForm from "../FormContainer";
import type { EndModeProps } from "../types";

export type EndFormModalContentProps = {
  timerId?: string;
  startTime?: string;
  pausedDuration?: number;
  /** "할 일 수정" 클릭 시 호출 (보통 모달 닫고 수정 모달 열기) */
  onEditClick: () => void;
};

/**
 * 타이머 종료(회고) 모달에 넣을 Form 용 props.
 * Form/end 모드에 "무엇이 들어가는지"는 이 파일만 보면 된다.
 */
export function EndFormModalContent({
  timerId,
  startTime,
  pausedDuration = 0,
  onEditClick,
}: EndFormModalContentProps) {
  const closeModal = useModalStore.getState().closeTop;
  const { todoTitle, savedTodos, setIsTimerRunning, setIsTimerPaused, setTodoTitle, setSavedTodos } =
    useTimerContext();
  const { finishTimerMutation } = useTimerMutations();

  const clearTimerState = () => {
    setIsTimerRunning(false);
    setIsTimerPaused(false);
    setTodoTitle("");
    setSavedTodos([]);
  };

  const props: EndModeProps = {
    mode: "end",
    initialTitle: todoTitle,
    initialTodos: savedTodos,
    onEditClick,
    onFinish: (reflection) => {
      if (timerId && startTime) {
        const splitTimes = calculateSplitTimes(startTime, new Date(), pausedDuration);
        finishTimerMutation.mutate(
          {
            timerId,
            data: { splitTimes, tasks: savedTodos, reflection: reflection.trim() },
          },
          {
            onSuccess: () => {
              clearTimerState();
              setTodoTitle("오늘도 열심히 달려봐요!");
              closeModal();
            },
            onError: (error: Error) => {
              console.error("타이머 종료 실패:", error);
              closeModal();
            },
          }
        );
      } else {
        clearTimerState();
        setTodoTitle("오늘도 열심히 달려봐요!");
        closeModal();
      }
    },
  };

  return <TodoListForm {...props} />;
}
