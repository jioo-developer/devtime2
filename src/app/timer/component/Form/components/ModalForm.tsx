"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { FormMode, TodoFormData } from "../types";
import { TodoListSection } from "./TodoListSection";
import { TodoInputSection } from "./TodoInputSection";
import { FormFooter } from "./FormFooter";
import { CommonTextArea } from "@/components/atoms/CommonTextArea/CommonTextArea";
import "../style.css";

const SAMPLE_TODOS = ["오늘의 목표 정하기", "할일 목록 작성하기", "타이머 시작하기"];

export default function ModalForm({ mode }: { mode: FormMode }) {
  const isEndMode = mode === "end";

  const {
    register,
    formState: { errors },
  } = useForm<TodoFormData>({
    mode: "onChange",
  });

  return (
    <div className="goalForm">
      <div className="todoSection">
        {/* end 모드 헤더 */}
        {isEndMode && (
          <div>
            <h2 className="headerTitle">오늘도 수고하셨어요!</h2>
            <p className="headerDescription">
              완료한 일을 체크하고, 오늘의 학습 회고를 작성해 주세요.
            </p>
          </div>
        )}

        {!isEndMode && <TodoInputSection register={register} mode={mode} />}

        {/* todo list */}
        <TodoListSection todos={SAMPLE_TODOS} />

        {/* end 모드 회고 */}
        {isEndMode && (
          <div className="reflectionContainer">
            <h3 className="sectionTitle">학습 회고</h3>

            <CommonTextArea
              rows={8}
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
              placeholder="오늘 학습한 내용을 회고해 보세요. (15자 이상 작성 필수)"
              className="reflectionTextarea"
              error={errors.reflection?.message}
            />
          </div>
        )}

        <FormFooter mode={mode} />
      </div>
    </div>
  );
}
