import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputFields from "../component/InputFileds";
import { useForm } from "react-hook-form";
import { authInputType } from "../Client";
import * as useCheckEmail from "../hooks/email/useCheckEmail";
import * as useCheckNickname from "../hooks/nickname/useCheckNickname";

const mockHandleCheckEmail = vi.fn();
const mockHandleCheckNickname = vi.fn();

vi.mock("../hooks/email/useCheckEmail");
vi.mock("../hooks/nickname/useCheckNickname");

vi.spyOn(useCheckEmail, "handleCheckEmail").mockImplementation(
  mockHandleCheckEmail
);
vi.spyOn(useCheckNickname, "handleCheckNickname").mockImplementation(
  mockHandleCheckNickname
);

// Test wrapper component
const TestWrapper = () => {
  const {
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<authInputType>({
    mode: "onChange",
  });

  return (
    <InputFields
      register={register}
      errors={errors}
      watch={watch}
      setError={setError}
      clearErrors={clearErrors}
      emailSuccess=""
      setEmailSuccess={vi.fn()}
      nicknameSuccess=""
      setNicknameSuccess={vi.fn()}
    />
  );
};

describe("InputFields - 입력 필드 컴포넌트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("모든 입력 필드가 렌더링되어야 한다", () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText("아이디")).toBeInTheDocument();
    expect(screen.getByLabelText("닉네임")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호 확인")).toBeInTheDocument();
  });

  it("이메일 중복 확인 버튼 클릭 시 핸들러가 호출되어야 한다", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const emailInput = screen.getByLabelText("아이디");
    const checkButtons = screen.getAllByText("중복 확인");

    await user.type(emailInput, "test@example.com");
    await user.click(checkButtons[0]); // 첫 번째 중복 확인 버튼 (이메일)

    await waitFor(() => {
      expect(mockHandleCheckEmail).toHaveBeenCalled();
    });
  });

  it("닉네임 중복 확인 버튼 클릭 시 핸들러가 호출되어야 한다", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const nicknameInput = screen.getByLabelText("닉네임");
    const checkButtons = screen.getAllByText("중복 확인");

    await user.type(nicknameInput, "testnickname");
    await user.click(checkButtons[1]); // 두 번째 중복 확인 버튼 (닉네임)

    await waitFor(() => {
      expect(mockHandleCheckNickname).toHaveBeenCalled();
    });
  });

  it("placeholder가 올바르게 표시되어야 한다", () => {
    render(<TestWrapper />);

    expect(
      screen.getByPlaceholderText("아이디를 입력하세요")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("닉네임을 입력해주세요")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("비밀번호를 8자리 이상 입력하세요")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("비밀번호를 다시 입력해 주세요.")
    ).toBeInTheDocument();
  });
});
