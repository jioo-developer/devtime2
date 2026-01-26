import { UseFormRegister } from "react-hook-form";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import { TodoFormData } from "../../../types";
import styles from "./items.module.css";

interface TitleInputProps {
  mode?: "create" | "edit";
  register: UseFormRegister<TodoFormData>;
}

export function TitleInput({ mode = "create", register }: TitleInputProps) {
  if (mode === "edit") return null;

  return (
    <CommonInput
      id="title"
      type="text"
      placeholder="오늘의 목표"
      register={register}
      className={styles.titleInputNoBorder}
      validation={{
        required: "목표를 입력해 주세요.",
        maxLength: {
          value: 30,
          message: "최대 30자까지 입력 가능합니다.",
        },
      }}
    />
  );
}
