import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommonAutocomplete from "./CommonAutoComplate";

describe("CommonAutocomplete", () => {
  const mockOptions = [
    { value: "option1", label: "옵션 1" },
    { value: "option2", label: "옵션 2" },
    { value: "option3", label: "옵션 3" },
  ];

  it("라벨이 올바르게 렌더링된다", () => {
    render(
      <CommonAutocomplete
        label="테스트 라벨"
        options={mockOptions}
        placeholder="입력하세요"
      />,
    );

    expect(screen.getByText("테스트 라벨")).toBeInTheDocument();
  });

  it("placeholder가 올바르게 표시된다", () => {
    render(
      <CommonAutocomplete
        options={mockOptions}
        placeholder="검색어를 입력하세요"
      />,
    );

    expect(
      screen.getByPlaceholderText("검색어를 입력하세요"),
    ).toBeInTheDocument();
  });

  it("입력 시 필터링된 옵션이 표시된다", async () => {
    render(<CommonAutocomplete options={mockOptions} placeholder="입력" />);

    const input = screen.getByPlaceholderText("입력");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "옵션 1" } });

    await waitFor(() => {
      expect(screen.getByText("옵션 1")).toBeInTheDocument();
    });
  });

  it("옵션 선택 시 onChange가 호출된다", async () => {
    const handleChange = vi.fn();
    render(
      <CommonAutocomplete
        options={mockOptions}
        placeholder="입력"
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText("입력");
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("옵션 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("옵션 1"));

    expect(handleChange).toHaveBeenCalledWith("옵션 1");
  });

  it("멀티 셀렉트 모드에서 여러 항목을 선택할 수 있다", async () => {
    const handleSelectedItemsChange = vi.fn();
    render(
      <CommonAutocomplete
        options={mockOptions}
        placeholder="입력"
        multiSelect={true}
        selectedItems={[]}
        onSelectedItemsChange={handleSelectedItemsChange}
      />,
    );

    const input = screen.getByPlaceholderText("입력");
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("옵션 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("옵션 1"));

    expect(handleSelectedItemsChange).toHaveBeenCalled();
  });

  it("새 항목 추가 버튼이 표시되고 동작한다", async () => {
    const handleAddNew = vi.fn();
    render(
      <CommonAutocomplete
        options={mockOptions}
        placeholder="입력"
        showAddButton={true}
        onAddNew={handleAddNew}
      />,
    );

    const input = screen.getByPlaceholderText("입력");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "새 항목" } });

    await waitFor(() => {
      const addButton = screen.getByText(/Add New Item/);
      expect(addButton).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Add New Item/));

    expect(handleAddNew).toHaveBeenCalledWith("새 항목");
  });

  it("선택된 항목을 제거할 수 있다", async () => {
    const handleSelectedItemsChange = vi.fn();
    render(
      <CommonAutocomplete
        options={mockOptions}
        placeholder="입력"
        multiSelect={true}
        selectedItems={["option1"]}
        onSelectedItemsChange={handleSelectedItemsChange}
      />,
    );

    const removeButton = screen.getByRole("button", { name: /제거|삭제|×/i });
    fireEvent.click(removeButton);

    expect(handleSelectedItemsChange).toHaveBeenCalled();
  });
});
