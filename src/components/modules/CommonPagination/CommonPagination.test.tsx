import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CommonPagination from "./CommonPagination";

describe("CommonPagination", () => {
  it("현재 페이지가 활성화 상태로 표시된다", () => {
    render(
      <CommonPagination
        currentPage={3}
        totalPages={10}
        onPageChange={vi.fn()}
        testId="pagination"
      />,
    );

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toHaveClass(/active/);
  });

  it("페이지 번호 클릭 시 onPageChange가 호출된다", () => {
    const handlePageChange = vi.fn();
    render(
      <CommonPagination
        currentPage={1}
        totalPages={10}
        onPageChange={handlePageChange}
      />,
    );

    const page5Button = screen.getByText("5");
    fireEvent.click(page5Button);

    expect(handlePageChange).toHaveBeenCalledWith(5);
  });

  it("이전 페이지 버튼이 올바르게 동작한다", () => {
    const handlePageChange = vi.fn();
    render(
      <CommonPagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
      />,
    );

    const prevButton = screen.getByLabelText("이전 페이지");
    fireEvent.click(prevButton);

    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it("다음 페이지 버튼이 올바르게 동작한다", () => {
    const handlePageChange = vi.fn();
    render(
      <CommonPagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
      />,
    );

    const nextButton = screen.getByLabelText("다음 페이지");
    fireEvent.click(nextButton);

    expect(handlePageChange).toHaveBeenCalledWith(6);
  });

  it("첫 페이지에서 이전 버튼이 비활성화된다", () => {
    render(
      <CommonPagination
        currentPage={1}
        totalPages={10}
        onPageChange={vi.fn()}
      />,
    );

    const prevButton = screen.getByLabelText("이전 페이지");
    expect(prevButton).toBeDisabled();
  });

  it("마지막 페이지에서 다음 버튼이 비활성화된다", () => {
    render(
      <CommonPagination
        currentPage={10}
        totalPages={10}
        onPageChange={vi.fn()}
      />,
    );

    const nextButton = screen.getByLabelText("다음 페이지");
    expect(nextButton).toBeDisabled();
  });

  it("처음/마지막 페이지 버튼이 표시된다", () => {
    render(
      <CommonPagination
        currentPage={5}
        totalPages={10}
        onPageChange={vi.fn()}
        showFirstLast={true}
      />,
    );

    expect(screen.getByLabelText("처음 페이지")).toBeInTheDocument();
    expect(screen.getByLabelText("마지막 페이지")).toBeInTheDocument();
  });

  it("처음 페이지 버튼 클릭 시 1페이지로 이동한다", () => {
    const handlePageChange = vi.fn();
    render(
      <CommonPagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
        showFirstLast={true}
      />,
    );

    const firstButton = screen.getByLabelText("처음 페이지");
    fireEvent.click(firstButton);

    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it("마지막 페이지 버튼 클릭 시 마지막 페이지로 이동한다", () => {
    const handlePageChange = vi.fn();
    render(
      <CommonPagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
        showFirstLast={true}
      />,
    );

    const lastButton = screen.getByLabelText("마지막 페이지");
    fireEvent.click(lastButton);

    expect(handlePageChange).toHaveBeenCalledWith(10);
  });

  it("페이지가 많을 때 생략 기호가 표시된다", () => {
    render(
      <CommonPagination
        currentPage={5}
        totalPages={20}
        onPageChange={vi.fn()}
      />,
    );

    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it("같은 페이지를 클릭하면 onPageChange가 호출되지 않는다", () => {
    const handlePageChange = vi.fn();
    render(
      <CommonPagination
        currentPage={5}
        totalPages={10}
        onPageChange={handlePageChange}
      />,
    );

    const currentPageButton = screen.getByText("5");
    fireEvent.click(currentPageButton);

    expect(handlePageChange).not.toHaveBeenCalled();
  });
});
