"use client";

import { useTimerContext } from "@/app/timer/provider/TimerContext";
import { useTimerMutations } from "@/app/timer/hooks/mutations";
import { useModalStore } from "@/store/modalStore";
import TodoListForm from "../FormContainer";
import type { EditModeProps } from "../types";

export type EditFormModalContentProps = {
  studyLogId?: string;
};

/**
 * 할 일 목록 수정 모달에 넣을 Form 용 props.
 * Form/edit 모드에 "무엇이 들어가는지"는 이 파일만 보면 된다.
 */
export function EditFormModalContent({ studyLogId }: EditFormModalContentProps) {
  const closeModal = useModalStore.getState().closeTop;
  const { todoTitle, savedTodos, setTodoTitle, setSavedTodos } = useTimerContext();
  const { updateTasksMutation } = useTimerMutations();

  const props: EditModeProps = {
    mode: "edit",
    initialTitle: todoTitle,
    initialTodos: savedTodos,
    onSave: (title, todos) => {
      if (studyLogId) {
        updateTasksMutation.mutate(
          { studyLogId, tasks: todos },
          {
            onSuccess: () => {
              setTodoTitle(title);
              setSavedTodos(todos);
              closeModal();
            },
            onError: (error: Error) => {
              console.error("할 일 목록 업데이트 실패:", error);
              setTodoTitle(title);
              setSavedTodos(todos);
              closeModal();
            },
          }
        );
      } else {
        setTodoTitle(title);
        setSavedTodos(todos);
        closeModal();
      }
    },
  };

  return <TodoListForm {...props} />;
}
