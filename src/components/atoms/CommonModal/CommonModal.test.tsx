import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UIModalBase from "./CommonModal";

describe("UIModalBase", () => {
  const mockOnRequestClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
  });

  it("모달이 정상적으로 렌더링된다", () => {
    render(
      <UIModalBase
        isTop={true}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
        testId="test-modal"
      >
        <div>모달 내용</div>
      </UIModalBase>,
    );

    expect(screen.getByTestId("test-modal")).toBeInTheDocument();
    expect(screen.getByText("모달 내용")).toBeInTheDocument();
  });

  it("title이 표시된다", () => {
    render(
      <UIModalBase
        isTop={true}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
        title="테스트 제목"
      >
        <div>내용</div>
      </UIModalBase>,
    );

    expect(screen.getByText("테스트 제목")).toBeInTheDocument();
  });

  it("footer가 표시된다", () => {
    render(
      <UIModalBase
        isTop={true}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
        footer={<button>푸터 버튼</button>}
      >
        <div>내용</div>
      </UIModalBase>,
    );

    expect(screen.getByText("푸터 버튼")).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onRequestClose가 호출된다", () => {
    render(
      <UIModalBase
        isTop={true}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
      >
        <div>내용</div>
      </UIModalBase>,
    );

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    expect(mockOnRequestClose).toHaveBeenCalledTimes(1);
  });

  it("backdrop 클릭 시 BackdropMiss이 true면 onRequestClose가 호출된다", () => {
    render(
      <UIModalBase
        isTop={true}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
      >
        <div>내용</div>
      </UIModalBase>,
    );

    const modals = document.body.querySelectorAll('[aria-hidden="false"]');
    const modal = modals[0];
    const backdrop = modal?.firstChild as HTMLElement;

    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(mockOnRequestClose).toHaveBeenCalled();
  });

  it("backdrop 클릭 시 BackdropMiss이 false면 onRequestClose가 호출되지 않는다", () => {
    render(
      <UIModalBase
        isTop={true}
        zIndex={1000}
        BackdropMiss={false}
        onRequestClose={mockOnRequestClose}
        testId="test-modal"
      >
        <div>내용</div>
      </UIModalBase>,
    );

    const modal = screen.getByTestId("test-modal");
    const backdrop = modal.firstChild as HTMLElement;

    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(mockOnRequestClose).not.toHaveBeenCalled();
  });

  it("isTop이 false일 때 닫기 버튼이 렌더링되지 않는다", () => {
    render(
      <UIModalBase
        isTop={false}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
      >
        <div>내용</div>
      </UIModalBase>,
    );

    const closeButton = screen.queryByLabelText("close");
    expect(closeButton).toBeNull();
  });

  it("isTop이 false일 때 닫기 버튼 클릭해도 onRequestClose가 호출되지 않는다", () => {
    render(
      <UIModalBase
        title="제목"
        isTop={false}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
      >
        <div>내용</div>
      </UIModalBase>,
    );

    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);

    expect(mockOnRequestClose).not.toHaveBeenCalled();
  });

  it("panel이 정상적으로 렌더링된다", () => {
    render(
      <UIModalBase
        isTop={true}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
      >
        <div>내용</div>
      </UIModalBase>,
    );

    const panel = document.body.querySelector('[role="dialog"]');
    expect(panel).toBeTruthy();
  });

  it("aria-hidden이 isTop에 따라 올바르게 설정된다", () => {
    const { rerender } = render(
      <UIModalBase
        isTop={true}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
        testId="test-modal"
      >
        <div>내용</div>
      </UIModalBase>,
    );

    expect(screen.getByTestId("test-modal")).toHaveAttribute(
      "aria-hidden",
      "false",
    );

    rerender(
      <UIModalBase
        isTop={false}
        zIndex={1000}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
        testId="test-modal"
      >
        <div>내용</div>
      </UIModalBase>,
    );

    expect(screen.getByTestId("test-modal")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("zIndex가 올바르게 적용된다", () => {
    render(
      <UIModalBase
        isTop={true}
        zIndex={1500}
        BackdropMiss={true}
        onRequestClose={mockOnRequestClose}
        testId="test-modal"
      >
        <div>내용</div>
      </UIModalBase>,
    );

    const modal = screen.getByTestId("test-modal");
    expect(modal).toHaveStyle({ zIndex: 1500 });
  });
});
