"use client";

import { UseFormRegister } from "react-hook-form";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { FormMode, TodoFormData } from "../types";

type TodoInputSectionProps = {
  register: UseFormRegister<TodoFormData>;
  mode: FormMode;
};

export function TodoInputSection({ register, mode }: TodoInputSectionProps) {
  return (
    <form className="inputGroup">
      {mode === "create" && (
        <CommonInput
          id="title"
          type="text"
          placeholder="오늘의 목표"
          register={register}
          className="titleInputNoBorder"
          validation={{
            required: "목표를 입력해 주세요.",
            maxLength: {
              value: 30,
              message: "최대 30자까지 입력 가능합니다.",
            },
          }}
        />
      )}

      <div className="todoInput">
        <CommonInput
          id="todoInput"
          type="text"
          placeholder="할 일을 입력해주세요. (최대 30자)"
          register={register}
          className="todoInputNoBorder"
          validation={{
            maxLength: {
              value: 30,
              message: "최대 30자까지 입력 가능합니다.",
            },
          }}
        />

        <CommonButton type="button" theme="none">
          추가
        </CommonButton>
      </div>
    </form>
  );
}
