import TodoListItem from "@/components/modules/TodoList/ListItem";
import type { TodoStatus } from "@/components/modules/TodoList/useTodoListController";
import type { FormMode } from "../types";
import "../style.css";

export type TodoItem = { content: string; isCompleted: boolean };

interface TodoListSectionProps {
  todos: TodoItem[] | string[];
  mode?: FormMode;
  onDelete?: (index: number) => void;
  onTextChange?: (index: number) => (nextText: string) => void;
  /** 체크박스(완료) 변경. ListItem의 "disabled" = 완료됨(isCompleted true) */
  onStatusChange?: (index: number) => (isCompleted: boolean) => void;
}

function normalizeTodo(item: TodoItem | string): TodoItem {
  return typeof item === "string"
    ? { content: item, isCompleted: false }
    : item;
}

export function TodoListSection({
  todos,
  mode,
  onDelete,
  onTextChange,
  onStatusChange,
}: TodoListSectionProps) {
  const items = todos.map(normalizeTodo);
  if (!items.length) return null;

  return (
    <div className="todoList">
      <div className="headerContainer">
        <h3 className="sectionTitle">할 일 목록</h3>
      </div>
      {items.map((todo, index) => (
        <TodoListItem
          key={index}
          text={todo.content}
          initialStatus={todo.isCompleted ? "disabled" : "default"}
          mode={mode}
          onDelete={onDelete ? () => onDelete(index) : undefined}
          onTextChange={onTextChange?.(index)}
          onStatusChange={
            onStatusChange?.(index)
              ? (next: TodoStatus) =>
                onStatusChange(index)(next === "disabled")
              : undefined
          }
        />
      ))}
    </div>
  );
}
