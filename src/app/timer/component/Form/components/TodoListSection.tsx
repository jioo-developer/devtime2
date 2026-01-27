import TodoListItem from "@/components/modules/TodoList/ListItem";
import { MdEdit } from "react-icons/md";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { FormMode } from "../types";
import "../style.css";
interface TodoListSectionProps {
  mode?: FormMode;
  todos: string[];
}

export function TodoListSection({
  todos,
}: TodoListSectionProps) {
  if (todos.length === 0) return null;

  return (
    <div className="todoList">
      <div className="headerContainer">
        <h3 className="sectionTitle">할 일 목록</h3>
        <CommonButton theme="none" type="button"
          style={{ display: "flex", alignItems: "center", gap: "var(--gap-md)", padding: 0 }}>
          <MdEdit size={16} />
          <span>할일 수정</span>
        </CommonButton>
      </div>
      {todos.map((todo, index) => (
        <TodoListItem
          key={index}
          text={todo}
        />
      ))}
    </div>
  );
}
