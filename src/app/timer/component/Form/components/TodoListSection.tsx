import TodoListItem from "@/components/modules/TodoList/ListItem";
import { MdEdit } from "react-icons/md";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { FormMode } from "../types";
import "../style.css";
interface TodoListSectionProps {
  mode?: FormMode;
  todos: string[];
  onDelete?: (index: number) => void;
  onTextChange?: (index: number) => (nextText: string) => void;
}

export function TodoListSection({
  todos,
  onDelete,
  onTextChange,
}: TodoListSectionProps) {
  if (!todos?.length) return null;

  return (
    <div className="todoList">
      <div className="headerContainer">
        <h3 className="sectionTitle">할 일 목록</h3>
        <CommonButton
          theme="none"
          type="button"
          className="editButton"
        >
          <MdEdit size={16} />
          <span>할일 수정</span>
        </CommonButton>
      </div>
      {todos.map((todo, index) => (
        <TodoListItem
          key={index}
          text={todo}
          onDelete={onDelete ? () => onDelete(index) : undefined}
          onTextChange={onTextChange?.(index)}
        />
      ))}
    </div>
  );
}
