import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleCheckEmail } from "../hooks/email/useCheckEmail";
import { checkEmailDuplicate } from "../hooks/email/checkEmailApi";

// Mock API
vi.mock("../hooks/email/checkEmailApi", () => ({
  checkEmailDuplicate: vi.fn(),
}));

describe("useCheckEmail - 이메일 중복 체크", () => {
  const mockSetError = vi.fn();
  const mockClearErrors = vi.fn();
  const mockSetSuccessMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("이메일이 비어있으면 에러 메시지를 설정해야 한다", async () => {
    await handleCheckEmail({
      email: "",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockSetError).toHaveBeenCalledWith("idRequired", {
      type: "manual",
      message: "이메일을 입력하세요.",
    });
  });

  it("유효하지 않은 이메일 형식이면 에러 메시지를 설정해야 한다", async () => {
    await handleCheckEmail({
      email: "invalid-email",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockSetError).toHaveBeenCalledWith("idRequired", {
      type: "manual",
      message: "이메일 형식으로 작성해 주세요.",
    });
  });

  it("사용 가능한 이메일이면 성공 메시지를 설정해야 한다", async () => {
    vi.mocked(checkEmailDuplicate).mockResolvedValueOnce({
      success: true,
      available: true,
      message: "사용 가능한 이메일입니다.",
    });

    await handleCheckEmail({
      email: "test@example.com",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockClearErrors).toHaveBeenCalledWith("idRequired");
    expect(mockSetSuccessMessage).toHaveBeenCalledWith(
      "사용 가능한 이메일입니다."
    );
  });

  it("중복된 이메일이면 에러 메시지를 설정해야 한다", async () => {
    vi.mocked(checkEmailDuplicate).mockResolvedValueOnce({
      success: true,
      available: false,
      message: "이미 사용 중인 이메일입니다.",
    });

    await handleCheckEmail({
      email: "duplicate@example.com",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockSetError).toHaveBeenCalledWith("idRequired", {
      type: "manual",
      message: "이미 사용 중인 이메일입니다.",
    });
  });

  it("API 호출 실패 시 에러 메시지를 설정해야 한다", async () => {
    vi.mocked(checkEmailDuplicate).mockRejectedValueOnce(
      new Error("Network error")
    );

    await handleCheckEmail({
      email: "test@example.com",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockSetError).toHaveBeenCalledWith("idRequired", {
      type: "manual",
      message: "이메일 중복 체크에 실패했습니다.",
    });
  });
});
