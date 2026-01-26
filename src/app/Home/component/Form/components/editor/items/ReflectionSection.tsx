import { CommonTextArea } from "@/components/atoms/CommonTextArea/CommonTextArea";
import { UseFormRegister } from "react-hook-form";
import { TodoFormData } from "../../../types";
import styles from "./items.module.css";

interface ReflectionSectionProps {
  register: UseFormRegister<TodoFormData>;
}

export function ReflectionSection({ register }: ReflectionSectionProps) {
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
        })}
        placeholder="오늘 학습한 내용을 최고해 보세요(15자 이상 작성 필수)."
        className={styles.reflectionTextarea}
      />
    </div>
  );
}
