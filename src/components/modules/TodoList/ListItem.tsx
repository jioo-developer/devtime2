import React from "react";
import { MdEdit, MdDelete, MdCheck } from "react-icons/md";
import styles from "./style.module.css";
import codeIcon from "@/asset/images/code-icon.png";
import CommonCheckbox from "@/components/atoms/CommonCheckbox/CommonCheckbox";
import { TodoStatus, useTodoListItemController } from "./useTodoListController";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";

interface TodoListItemProps {
  text: string;
  initialStatus?: TodoStatus;

  onTextChange?: (nextText: string) => void;
  onStatusChange?: (nextStatus: TodoStatus) => void;
  onDelete?: () => void;
}

export default function TodoListItem({
  text,
  initialStatus = "default",
  onTextChange,
  onStatusChange,
  onDelete,
}: TodoListItemProps) {
  const {
    status,
    currentText,
    isDisabled,
    isTyping,
    setCurrentText,
    startEdit,
    finishEdit,
    cancelEdit,
    toggleDisabled,
    requestDelete,
  } = useTodoListItemController({
    text,
    initialStatus,
    onTextChange,
    onStatusChange,
    onDelete,
  });

  return (
    <div
      className={`${styles.todoItem} ${styles[status]}`}
      aria-disabled={isDisabled}
    >
      <div className={styles.leftSection}>
        <CommonImage
          src={codeIcon}
          alt="code icon"
          width={24}
          height={24}
          className={styles.codeIcon}
        />

        {isTyping ? (
          <input
            className={styles.textInput}
            value={currentText}
            disabled={isDisabled}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setCurrentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") finishEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            onBlur={() => finishEdit()}
            autoFocus
          />
        ) : (
          <span className={styles.text}>{currentText}</span>
        )}
      </div>

      <div className={styles.rightSection}>
        {/* typing 상태: 저장 체크 */}
        {isTyping && (
          <button
            className={styles.iconButton}
            onClick={(e) => {
              e.stopPropagation();
              finishEdit();
            }}
            disabled={isDisabled}
            aria-label="save"
          >
            <MdCheck size={20} />
          </button>
        )}

        {/* active/default 상태: edit/delete */}
        {(status === "active" || status === "default") && !isDisabled && (
          <>
            <button
              className={styles.iconButton}
              onClick={(e) => {
                e.stopPropagation();
                startEdit();
              }}
              aria-label="edit"
            >
              <MdEdit size={20} />
            </button>

            <button
              style={{ paddingRight: 8 }}
              className={styles.iconButton}
              onClick={(e) => {
                e.stopPropagation();
                requestDelete();
              }}
              aria-label="delete"
            >
              <MdDelete size={20} />
            </button>
          </>
        )}

        {/* 체크박스로 disable/enable 토글 */}
        <CommonCheckbox
          checked={isDisabled}
          onChange={() => {
            toggleDisabled();
          }}
          onClick={(e) => e.stopPropagation()}
          color="white"
          size={20}
        />
      </div>
    </div>
  );
}
