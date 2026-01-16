import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoListItem from "./TodoListItem";

describe("TodoListItem", () => {
  it("할 일 텍스트를 렌더링한다", () => {
    render(<TodoListItem text="Test Todo" />);
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
  });

  it("코드 아이콘을 표시한다", () => {
    render(<TodoListItem text="Test Todo" />);
    const icon = screen.getByAltText("code icon");
    expect(icon).toBeInTheDocument();
  });

  it("기본 상태에서 수정 및 삭제 버튼을 표시한다", () => {
    render(<TodoListItem text="Test Todo" initialStatus="default" />);

    expect(screen.getByLabelText("edit")).toBeInTheDocument();
    expect(screen.getByLabelText("delete")).toBeInTheDocument();
  });

  it("수정 버튼을 클릭하면 입력 모드로 전환된다", async () => {
    render(<TodoListItem text="Test Todo" />);

    const editButton = screen.getByLabelText("edit");
    await userEvent.click(editButton);

    const input = screen.getByDisplayValue("Test Todo");
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it("Enter 키를 누르면 변경사항을 저장한다", async () => {
    const handleTextChange = vi.fn();
    render(<TodoListItem text="Test Todo" onTextChange={handleTextChange} />);

    const editButton = screen.getByLabelText("edit");
    await userEvent.click(editButton);

    const input = screen.getByDisplayValue("Test Todo");
    await userEvent.clear(input);
    await userEvent.type(input, "Updated Todo{Enter}");

    await waitFor(() => {
      expect(handleTextChange).toHaveBeenCalledWith("Updated Todo");
    });
  });

  it("Escape 키를 누르면 편집을 취소한다", async () => {
    render(<TodoListItem text="Test Todo" />);

    const editButton = screen.getByLabelText("edit");
    await userEvent.click(editButton);

    const input = screen.getByDisplayValue("Test Todo") as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, "Changed");

    // Clear the input and verify it goes back to non-editing mode
    const textBeforeEscape = input.value;
    await userEvent.keyboard("{Escape}");

    // After escape, should exit typing mode
    await waitFor(() => {
      expect(
        screen.queryByDisplayValue(textBeforeEscape)
      ).not.toBeInTheDocument();
    });
  });

  it("삭제 버튼을 클릭하면 onDelete를 호출한다", async () => {
    const handleDelete = vi.fn();
    render(<TodoListItem text="Test Todo" onDelete={handleDelete} />);

    const deleteButton = screen.getByLabelText("delete");
    await userEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalled();
  });

  it("체크박스로 비활성 상태를 토글한다", async () => {
    const handleStatusChange = vi.fn();
    render(
      <TodoListItem text="Test Todo" onStatusChange={handleStatusChange} />
    );

    const checkbox = screen.getByRole("button", { name: "" });
    await userEvent.click(checkbox);

    await waitFor(() => {
      expect(handleStatusChange).toHaveBeenCalled();
    });
  });

  it("입력 모드에서 저장 버튼을 표시한다", async () => {
    render(<TodoListItem text="Test Todo" />);

    const editButton = screen.getByLabelText("edit");
    await userEvent.click(editButton);

    expect(screen.getByLabelText("save")).toBeInTheDocument();
  });

  it("비활성 상태일 때 수정/삭제 버튼을 표시하지 않는다", () => {
    render(<TodoListItem text="Test Todo" initialStatus="disabled" />);

    expect(screen.queryByLabelText("edit")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("delete")).not.toBeInTheDocument();
  });

  it("상태에 따라 올바른 CSS 클래스를 적용한다", () => {
    const { container } = render(
      <TodoListItem text="Test Todo" initialStatus="completed" />
    );

    const todoItem = container.querySelector("[aria-disabled]");
    expect(todoItem?.className).toContain("completed");
  });
});
