import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoListItem from "./TodoList";

describe("TodoListItem", () => {
  const mockOnTextChange = vi.fn();
  const mockOnStatusChange = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("렌더링", () => {
    it("기본 상태로 정상적으로 렌더링된다", () => {
      render(
        <TodoListItem
          text="Test Todo"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.getByText("Test Todo")).toBeInTheDocument();
      expect(screen.getByAltText("code icon")).toBeInTheDocument();
    });

    it("초기 상태를 올바르게 적용한다", () => {
      const { container } = render(
        <TodoListItem
          text="Test Todo"
          initialStatus="active"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const todoItem = container.querySelector('[class*="todoItem"]');
      expect(todoItem?.className).toContain("active");
    });

    it("disabled 상태로 렌더링된다", () => {
      const { container } = render(
        <TodoListItem
          text="Test Todo"
          initialStatus="disabled"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const todoItem = container.querySelector('[class*="todoItem"]');
      expect(todoItem).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("편집 기능", () => {
    it("편집 버튼 클릭 시 입력 모드로 전환된다", async () => {
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="active"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const editButton = screen.getByLabelText("edit");
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByRole("textbox")).toBeInTheDocument();
      });

      expect(mockOnStatusChange).toHaveBeenCalledWith("typing");
    });

    it("텍스트 입력 시 변경된다", async () => {
      const user = userEvent.setup();
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="active"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const editButton = screen.getByLabelText("edit");
      fireEvent.click(editButton);

      const input = await screen.findByRole("textbox");
      await user.clear(input);
      await user.type(input, "Updated Todo");

      expect(input).toHaveValue("Updated Todo");
    });

    it("Enter 키로 편집을 완료한다", async () => {
      const user = userEvent.setup();
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="active"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const editButton = screen.getByLabelText("edit");
      fireEvent.click(editButton);

      const input = await screen.findByRole("textbox");
      await user.clear(input);
      await user.type(input, "Updated Todo{Enter}");

      await waitFor(() => {
        expect(mockOnTextChange).toHaveBeenCalledWith("Updated Todo");
        expect(mockOnStatusChange).toHaveBeenCalledWith("active");
      });
    });

    it("Escape 키로 편집을 취소한다", async () => {
      const user = userEvent.setup();
      render(
        <TodoListItem
          text="Original Todo"
          initialStatus="active"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const editButton = screen.getByLabelText("edit");
      fireEvent.click(editButton);

      const input = await screen.findByRole("textbox");
      await user.type(input, " Modified{Escape}");

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith("active");
      });

      // userEvent.type은 각 키 입력마다 onChange를 트리거하므로
      // 텍스트 변경이 호출되었는지 확인
      expect(mockOnTextChange).toHaveBeenCalled();
    });

    it("체크 버튼 클릭으로 편집을 완료한다", async () => {
      const user = userEvent.setup();
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="active"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const editButton = screen.getByLabelText("edit");
      fireEvent.click(editButton);

      const input = await screen.findByRole("textbox");
      await user.clear(input);
      await user.type(input, "New Text");

      const saveButton = screen.getByLabelText("save");
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnTextChange).toHaveBeenCalledWith("New Text");
        expect(mockOnStatusChange).toHaveBeenCalledWith("active");
      });
    });

    it("빈 텍스트로 저장 시 empty 상태로 변경된다", async () => {
      const user = userEvent.setup();
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="active"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const editButton = screen.getByLabelText("edit");
      fireEvent.click(editButton);

      const input = await screen.findByRole("textbox");
      await user.clear(input);
      await user.type(input, "{Enter}");

      await waitFor(() => {
        expect(mockOnTextChange).toHaveBeenCalledWith("");
        expect(mockOnStatusChange).toHaveBeenCalledWith("empty");
      });
    });
  });

  describe("삭제 기능", () => {
    it("삭제 버튼 클릭 시 onDelete가 호출된다", () => {
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="active"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByLabelText("delete");
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it("disabled 상태에서는 삭제 버튼이 표시되지 않는다", () => {
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="disabled"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.queryByLabelText("delete")).not.toBeInTheDocument();
    });
  });

  describe("체크박스 기능", () => {
    it("체크박스 클릭 시 disabled 상태로 전환된다", async () => {
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="active"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith("disabled");
      });
    });

    it("disabled 상태에서 체크박스 클릭 시 active 상태로 복귀된다", async () => {
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="disabled"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(mockOnStatusChange).toHaveBeenCalledWith("active");
      });
    });

    it("체크박스는 disabled 상태와 동기화된다", () => {
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="disabled"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });
  });

  describe("이벤트 전파", () => {
    it("입력 필드 클릭 시 이벤트가 전파되지 않는다", async () => {
      const onItemClick = vi.fn();

      render(
        <div onClick={onItemClick}>
          <TodoListItem
            text="Test Todo"
            initialStatus="active"
            onTextChange={mockOnTextChange}
            onStatusChange={mockOnStatusChange}
            onDelete={mockOnDelete}
          />
        </div>,
      );

      const editButton = screen.getByLabelText("edit");
      fireEvent.click(editButton);

      const input = await screen.findByRole("textbox");
      fireEvent.click(input);

      // 부모 요소의 클릭 이벤트가 호출되지 않아야 함
      expect(onItemClick).not.toHaveBeenCalled();
    });

    it("체크박스 클릭 시 이벤트가 전파되지 않는다", () => {
      const onItemClick = vi.fn();

      render(
        <div onClick={onItemClick}>
          <TodoListItem
            text="Test Todo"
            initialStatus="active"
            onTextChange={mockOnTextChange}
            onStatusChange={mockOnStatusChange}
            onDelete={mockOnDelete}
          />
        </div>,
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      // 부모 요소의 클릭 이벤트가 호출되지 않아야 함
      expect(onItemClick).not.toHaveBeenCalled();
    });
  });

  describe("disabled 상태 제약", () => {
    it("disabled 상태에서는 편집 버튼이 표시되지 않는다", () => {
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="disabled"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.queryByLabelText("edit")).not.toBeInTheDocument();
    });

    it("disabled 상태에서는 삭제 버튼이 표시되지 않는다", () => {
      render(
        <TodoListItem
          text="Test Todo"
          initialStatus="disabled"
          onTextChange={mockOnTextChange}
          onStatusChange={mockOnStatusChange}
          onDelete={mockOnDelete}
        />,
      );

      expect(screen.queryByLabelText("delete")).not.toBeInTheDocument();
    });
  });
});
