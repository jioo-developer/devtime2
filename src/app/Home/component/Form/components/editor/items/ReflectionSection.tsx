import { CommonTextArea } from "@/components/atoms/CommonTextArea/CommonTextArea";
import { UseFormRegister, FieldError } from "react-hook-form";
import { TodoFormData } from "../../../types";
import styles from "./items.module.css";

interface ReflectionSectionProps {
  register: UseFormRegister<TodoFormData>;
  error?: FieldError;
}

export function ReflectionSection({ register, error }: ReflectionSectionProps) {
  return (
    <div className={styles.reflectionContainer}>
      <h3 className="sectionTitle">학습 회고</h3>
      <CommonTextArea
        {...register("reflection", {
          required: "학습 회고를 작성해 주세요.",
          minLength: {
            value: 15,
            message: "15자 이상 작성해 주세요.",
          },
          maxLength: {
            value: 500,
            message: "500자 이하로 작성해 주세요.",
          },
        })}
        placeholder="오늘 학습한 내용을 최고해 보세요(15자 이상 작성 필수)."
        className={styles.reflectionTextarea}
        error={error?.message}
      />
    </div>
  );
}
