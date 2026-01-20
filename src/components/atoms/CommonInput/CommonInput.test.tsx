import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import CommonInput from "./CommonInput";

// 테스트용 래퍼 컴포넌트
function TestWrapper({ error, success }: { error?: string; success?: string }) {
  const { register } = useForm<{ testInput: string }>();

  return (
    <CommonInput
      id="testInput"
      label="테스트 입력"
      placeholder="입력하세요"
      register={register}
      error={error ? { type: "manual", message: error } : undefined}
      success={success}
      testId="test-input"
    />
  );
}

describe("CommonInput", () => {
  it("라벨이 올바르게 렌더링된다", () => {
    render(<TestWrapper />);

    expect(screen.getByText("테스트 입력")).toBeInTheDocument();
  });

  it("placeholder가 올바르게 표시된다", () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText("입력하세요")).toBeInTheDocument();
  });

  it("입력 필드에 텍스트를 입력할 수 있다", () => {
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("입력하세요") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "테스트 값" } });

    expect(input.value).toBe("테스트 값");
  });

  it("에러 메시지가 표시된다", () => {
    render(<TestWrapper error="필수 입력 항목입니다" />);

    expect(screen.getByText("필수 입력 항목입니다")).toBeInTheDocument();
    expect(screen.getByText("필수 입력 항목입니다")).toHaveClass("error");
  });

  it("성공 메시지가 표시된다", () => {
    render(<TestWrapper success="사용 가능합니다" />);

    expect(screen.getByText("사용 가능합니다")).toBeInTheDocument();
    expect(screen.getByText("사용 가능합니다")).toHaveClass("success");
  });

  it("에러가 있을 때 성공 메시지는 표시되지 않는다", () => {
    render(<TestWrapper error="에러 발생" success="성공 메시지" />);

    expect(screen.getByText("에러 발생")).toBeInTheDocument();
    expect(screen.queryByText("성공 메시지")).not.toBeInTheDocument();
  });

  it("타입이 password일 때 비밀번호 입력 필드로 렌더링된다", () => {
    function PasswordWrapper() {
      const { register } = useForm<{ password: string }>();
      return (
        <CommonInput
          id="password"
          type="password"
          placeholder="비밀번호"
          register={register}
        />
      );
    }

    render(<PasswordWrapper />);

    const input = screen.getByPlaceholderText("비밀번호");
    expect(input).toHaveAttribute("type", "password");
  });

  it("타입이 email일 때 이메일 입력 필드로 렌더링된다", () => {
    function EmailWrapper() {
      const { register } = useForm<{ email: string }>();
      return (
        <CommonInput
          id="email"
          type="email"
          placeholder="이메일"
          register={register}
        />
      );
    }

    render(<EmailWrapper />);

    const input = screen.getByPlaceholderText("이메일");
    expect(input).toHaveAttribute("type", "email");
  });

  it("타입이 number일 때 숫자 입력 필드로 렌더링된다", () => {
    function NumberWrapper() {
      const { register } = useForm<{ age: number }>();
      return (
        <CommonInput
          id="age"
          type="number"
          placeholder="나이"
          register={register}
        />
      );
    }

    render(<NumberWrapper />);

    const input = screen.getByPlaceholderText("나이");
    expect(input).toHaveAttribute("type", "number");
  });

  it("testId가 올바르게 설정된다", () => {
    render(<TestWrapper />);

    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });

  it("라벨 없이도 렌더링된다", () => {
    function NoLabelWrapper() {
      const { register } = useForm<{ input: string }>();
      return <CommonInput id="input" placeholder="입력" register={register} />;
    }

    render(<NoLabelWrapper />);

    expect(screen.getByPlaceholderText("입력")).toBeInTheDocument();
  });

  it("초기값이 설정된다", () => {
    function ValueWrapper() {
      const { register } = useForm<{ input: string }>();
      return (
        <CommonInput
          id="input"
          value="초기값"
          placeholder="입력"
          register={register}
        />
      );
    }

    render(<ValueWrapper />);

    const input = screen.getByPlaceholderText("입력") as HTMLInputElement;
    expect(input.value).toBe("초기값");
  });
});
