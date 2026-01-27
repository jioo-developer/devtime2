import TodoListItem from "@/components/modules/TodoList/ListItem";
import { MdEdit } from "react-icons/md";
import styles from "./items.module.css";

interface TodoListSectionProps {
  mode?: "create" | "edit" | "end";
  todos: string[];
  completedTodos?: boolean[];
  onCompletedChange?: (completed: boolean[]) => void;
  onEditClick?: () => void;
  onTextChange: (index: number) => (nextText: string) => void;
  onDelete: (index: number) => void;
}

export function TodoListSection({
  mode = "create",
  todos,
  completedTodos,
  onCompletedChange,
  onEditClick,
  onTextChange,
  onDelete,
}: TodoListSectionProps) {
  if (todos.length === 0) return null;

  const handleTodoStatusChange = (index: number, isCompleted: boolean) => {
    if (!onCompletedChange || !completedTodos) return;
    
    const updated = [...completedTodos];
    updated[index] = isCompleted;
    onCompletedChange(updated);
  };

  return (
    <div className="todoList">
      {(mode === "edit" || mode === "end") && (
        <div className={styles.headerContainer}>
          <h3 className="sectionTitle">할 일 목록</h3>
          {mode === "end" && onEditClick && (
            <button
              onClick={onEditClick}
              className={styles.editButton}
            >
              <MdEdit size={16} />
              <span>할일 수정</span>
            </button>
          )}
        </div>
      )}
      {todos.map((todo, index) => (
        <TodoListItem
          key={index}
          text={todo}
          initialStatus={mode === "end" && completedTodos?.[index] ? "disabled" : "default"}
          onTextChange={mode !== "end" ? onTextChange(index) : undefined}
          onStatusChange={mode === "end" ? (status) => handleTodoStatusChange(index, status === "disabled") : undefined}
          onDelete={mode !== "end" ? () => onDelete(index) : undefined}
        />
      ))}
    </div>
  );
}
