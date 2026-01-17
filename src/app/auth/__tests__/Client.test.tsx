import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Client from "../Client";

// Mock modules
vi.mock("@/utils/popupHandler", () => ({
  popuprHandler: vi.fn(),
  ReturnPopup: () => null,
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe("Client - 회원가입 컴포넌트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("회원가입 폼이 렌더링되어야 한다", () => {
    render(<Client />);

    expect(
      screen.getByRole("heading", { name: "회원가입" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("아이디")).toBeInTheDocument();
    expect(screen.getByLabelText("닉네임")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호 확인")).toBeInTheDocument();
    expect(screen.getByText("이용약관")).toBeInTheDocument();
  });

  it("초기 상태에서 회원가입 버튼이 비활성화되어야 한다", () => {
    render(<Client />);

    const submitButton = screen.getByRole("button", { name: "회원가입" });
    expect(submitButton).toBeDisabled();
  });

  it("중복 확인 버튼이 표시되어야 한다", () => {
    render(<Client />);

    const emailCheckButtons = screen.getAllByText("중복 확인");
    expect(emailCheckButtons).toHaveLength(2); // 이메일, 닉네임
  });

  it("비밀번호 유효성 검사가 실시간으로 작동해야 한다", async () => {
    const user = userEvent.setup();
    render(<Client />);

    const passwordInput = screen.getByLabelText("비밀번호");

    await user.type(passwordInput, "short");

    await waitFor(() => {
      expect(
        screen.getByText("비밀번호는 8자리 이상이어야 합니다.")
      ).toBeInTheDocument();
    });
  });

  it("비밀번호 확인이 일치하지 않으면 에러 메시지를 표시해야 한다", async () => {
    const user = userEvent.setup();
    render(<Client />);

    const passwordInput = screen.getByLabelText("비밀번호");
    const confirmInput = screen.getByLabelText("비밀번호 확인");

    await user.type(passwordInput, "password123");
    await user.type(confirmInput, "different123");

    await waitFor(() => {
      expect(
        screen.getByText("비밀번호가 일치하지 않습니다.")
      ).toBeInTheDocument();
    });
  });

  it("영문과 숫자가 포함되지 않은 비밀번호는 거부되어야 한다", async () => {
    const user = userEvent.setup();
    render(<Client />);

    const passwordInput = screen.getByLabelText("비밀번호");

    await user.type(passwordInput, "onlyletters");

    await waitFor(() => {
      expect(
        screen.getByText("비밀번호는 영문과 숫자를 포함해야 합니다.")
      ).toBeInTheDocument();
    });
  });

  it("로그인 바로가기 링크가 표시되어야 한다", () => {
    render(<Client />);

    expect(screen.getByText("회원이신가요?")).toBeInTheDocument();
    expect(screen.getByText("로그인 바로가기")).toBeInTheDocument();
  });
});
