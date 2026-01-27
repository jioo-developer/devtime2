import { useEffect, useMemo, useState } from "react";

export type TodoStatus =
  | "active"
  | "typing"
  | "empty"
  | "completed"
  | "default"
  | "disabled";

export interface UseTodoListItemControllerParams {
  text: string;
  initialStatus?: TodoStatus;

  onTextChange?: (nextText: string) => void;
  onStatusChange?: (nextStatus: TodoStatus) => void;
  onDelete?: () => void;
}

export function useTodoListItemController({
  text,
  initialStatus = "default",
  onTextChange,
  onStatusChange,
  onDelete,
}: UseTodoListItemControllerParams) {
  const [currentText, setCurrentText] = useState(text);
  const [status, setStatus] = useState<TodoStatus>(initialStatus);

  // 외부 text 변경을 내부에 동기화(리스트 리렌더, 서버 동기화 등)
  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  const isCompleted = status === "completed";
  const isDisabled = status === "disabled";
  const isTyping = status === "typing";
  const isEmpty = status === "empty";

  const updateStatus = (next: TodoStatus) => {
    setStatus(next);
    onStatusChange?.(next);
  };

  const updateText = (next: string) => {
    setCurrentText(next);
    onTextChange?.(next);
  };

  const normalizedText = useMemo(
    () => String(currentText ?? "").trim(),
    [currentText]
  );

  /** 아이템 클릭을 "완료 토글"로 사용 */
  const onItemClick = () => {
    if (isDisabled) return;
    if (isEmpty) return;
    toggleCompleted();
  };

  const startEdit = () => {
    if (isDisabled) return;
    if (isEmpty) return;
    if (isCompleted) return; // 정책: 완료 상태에서는 편집 불가(원하면 제거 가능)
    updateStatus("typing");
  };

  const finishEdit = () => {
    if (isDisabled) return;

    const trimmed = normalizedText;

    if (!trimmed) {
      updateText("");
      updateStatus("empty");
      return;
    }

    updateText(trimmed);

    // 편집 종료 후 상태 정책: 기본적으로 active로 복귀
    updateStatus("active");
  };

  const cancelEdit = () => {
    if (isDisabled) return;
    updateStatus("active");
  };

  const toggleCompleted = () => {
    if (isDisabled) return;
    if (isEmpty) return;
    if (isTyping) return; // 편집 중에는 완료 토글 막기(원하면 허용 가능)

    updateStatus(isCompleted ? "active" : "completed");
  };

  const toggleDisabled = () => {
    // disabled → enable 복귀 정책
    if (isDisabled) {
      // 완료였던 걸 기억하고 복귀시키고 싶으면 상태를 따로 저장하는 방식으로 확장 가능
      updateStatus("active");
      return;
    }
    updateStatus("disabled");
  };

  const requestDelete = () => {
    if (isDisabled) return;
    onDelete?.();
  };

  return {
    // state
    status,
    currentText,

    // flags
    isCompleted,
    isDisabled,
    isTyping,
    isEmpty,

    // setters
    setCurrentText: updateText,

    // handlers
    onItemClick,
    startEdit,
    finishEdit,
    cancelEdit,
    toggleCompleted,
    toggleDisabled,
    requestDelete,
  };
}
