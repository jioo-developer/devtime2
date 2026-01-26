import { UseFormRegister } from "react-hook-form";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { TodoFormData } from "../../../types";
import styles from "./items.module.css";

interface TodoInputSectionProps {
  mode?: "create" | "edit";
  register: UseFormRegister<TodoFormData>;
  todoInputValue: string;
  onAddTodo: () => void;
}

export function TodoInputSection({
  mode = "create",
  register,
  todoInputValue,
  onAddTodo,
}: TodoInputSectionProps) {
  return (
    <>
      {mode === "create" && <h3 className="sectionTitle">할일 목록</h3>}
      <div className="todoInput">
        <CommonInput
          id="todoInput"
          type="text"
          placeholder="할 일을 입력해주세요. (최대 30자)"
          register={register}
          className={styles.todoInputNoBorder}
          validation={{
            maxLength: {
              value: 30,
              message: "최대 30자까지 입력 가능합니다.",
            },
          }}
        />
        <CommonButton
          type="button"
          theme="none"
          className={`${styles.addButton} ${todoInputValue.trim() ? styles.addButtonEnabled : styles.addButtonDisabled}`}
          disabled={!todoInputValue.trim()}
          onClick={onAddTodo}
        >
          추가
        </CommonButton>
      </div>
    </>
  );
}
