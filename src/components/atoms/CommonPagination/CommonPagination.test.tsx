import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommonPagination from "./CommonPagination";

describe("CommonPagination", () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it("페이지 버튼을 올바르게 렌더링한다", () => {
    render(
      <CommonPagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("현재 페이지를 강조 표시한다", () => {
    render(
      <CommonPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByLabelText("3페이지");
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });

  it("첫 페이지에서 처음/이전 버튼을 비활성화한다", () => {
    render(
      <CommonPagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const firstButton = screen.getByLabelText("처음 페이지");
    const prevButton = screen.getByLabelText("이전 페이지");

    expect(firstButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
  });

  it("마지막 페이지에서 마지막/다음 버튼을 비활성화한다", () => {
    render(
      <CommonPagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const lastButton = screen.getByLabelText("마지막 페이지");
    const nextButton = screen.getByLabelText("다음 페이지");

    expect(lastButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it("페이지 버튼을 클릭하면 onPageChange를 호출한다", async () => {
    render(
      <CommonPagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const pageButton = screen.getByText("3");
    await userEvent.click(pageButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("다음 버튼을 클릭하면 다음 페이지로 이동한다", async () => {
    render(
      <CommonPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText("다음 페이지");
    await userEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("이전 버튼을 클릭하면 이전 페이지로 이동한다", async () => {
    render(
      <CommonPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByLabelText("이전 페이지");
    await userEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("처음 버튼을 클릭하면 첫 페이지로 이동한다", async () => {
    render(
      <CommonPagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const firstButton = screen.getByLabelText("처음 페이지");
    await userEvent.click(firstButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("마지막 버튼을 클릭하면 마지막 페이지로 이동한다", async () => {
    render(
      <CommonPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const lastButton = screen.getByLabelText("마지막 페이지");
    await userEvent.click(lastButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it("페이지 범위가 클 때 생략 부호를 표시한다", () => {
    render(
      <CommonPagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
      />
    );

    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it("showFirstLast가 false일 때 처음/마지막 버튼을 숨긴다", () => {
    render(
      <CommonPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        showFirstLast={false}
      />
    );

    expect(screen.queryByLabelText("처음 페이지")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("마지막 페이지")).not.toBeInTheDocument();
  });

  it("현재 페이지를 클릭할 때 onPageChange를 호출하지 않는다", async () => {
    render(
      <CommonPagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText("2");
    await userEvent.click(currentPageButton);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
});
