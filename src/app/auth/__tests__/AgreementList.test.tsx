import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AgreementList from "../component/AgreementList";

describe("AgreementList - 약관 동의 컴포넌트", () => {
  const mockSetAgreed = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("이용약관이 표시되어야 한다", () => {
    render(<AgreementList agreed={false} setAgreed={mockSetAgreed} />);

    expect(screen.getByText("이용약관")).toBeInTheDocument();
    expect(screen.getByText("동의함")).toBeInTheDocument();
  });

  it("약관 내용이 표시되어야 한다", () => {
    render(<AgreementList agreed={false} setAgreed={mockSetAgreed} />);

    expect(screen.getByText(/제1조 \(목적\)/)).toBeInTheDocument();
    expect(screen.getByText(/제2조 \(정의\)/)).toBeInTheDocument();
    expect(screen.getByText(/제6조 \(개인정보 보호\)/)).toBeInTheDocument();
  });

  it("체크박스 클릭 시 상태가 변경되어야 한다", async () => {
    const user = userEvent.setup();
    render(<AgreementList agreed={false} setAgreed={mockSetAgreed} />);

    const checkbox = screen.getByTestId("agreement-off");
    await user.click(checkbox);

    expect(mockSetAgreed).toHaveBeenCalledWith(true);
  });

  it("agreed prop에 따라 체크박스 상태가 반영되어야 한다", () => {
    const { rerender } = render(
      <AgreementList agreed={false} setAgreed={mockSetAgreed} />
    );

    expect(screen.getByTestId("agreement-off")).toBeInTheDocument();

    rerender(<AgreementList agreed={true} setAgreed={mockSetAgreed} />);

    expect(screen.getByTestId("agreement-on")).toBeInTheDocument();
  });
});
