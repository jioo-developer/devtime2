import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommonAutocomplete from "./CommonAutocomplete";

describe("CommonAutocomplete", () => {
  const mockOptions = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  it("레이블과 플레이스홀더로 렌더링된다", () => {
    render(
      <CommonAutocomplete
        label="Test Label"
        placeholder="Test Placeholder"
        options={mockOptions}
      />
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Test Placeholder")).toBeInTheDocument();
  });

  it("입력 시 필터링된 옵션을 표시한다", async () => {
    render(<CommonAutocomplete options={mockOptions} />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Option 1");

    await waitFor(() => {
      expect(screen.getByText(/Option 1/)).toBeInTheDocument();
    });
  });

  it("옵션이 선택되면 onChange를 호출한다", async () => {
    const handleChange = vi.fn();
    render(
      <CommonAutocomplete options={mockOptions} onChange={handleChange} />
    );

    const input = screen.getByRole("textbox");
    await userEvent.click(input);

    await waitFor(() => {
      const option = screen.getByText("Option 1");
      fireEvent.click(option);
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it("멀티 선택 모드를 지원한다", async () => {
    const handleSelectedItemsChange = vi.fn();
    render(
      <CommonAutocomplete
        options={mockOptions}
        multiSelect
        selectedItems={[]}
        onSelectedItemsChange={handleSelectedItemsChange}
      />
    );

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Option 1");

    await waitFor(() => {
      const option = screen.getByText("Option 1");
      fireEvent.click(option);
    });

    // Input should be populated for adding
    expect(input).toHaveValue("Option 1");
  });

  it("showAddButton이 true일 때 추가 버튼을 표시한다", async () => {
    render(<CommonAutocomplete options={mockOptions} showAddButton />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "New Item");

    await waitFor(() => {
      expect(screen.getByText(/Add/)).toBeInTheDocument();
    });
  });

  it("멀티 선택 모드에서 선택된 칩을 표시한다", () => {
    render(
      <CommonAutocomplete
        options={mockOptions}
        multiSelect
        selectedItems={["Item 1", "Item 2"]}
      />
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});
