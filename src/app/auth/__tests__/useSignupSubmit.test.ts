import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleSignupSubmit } from "../hooks/useSignupSubmit";
import { popuprHandler } from "@/utils/popupHandler";

// Mock modules
vi.mock("@/utils/popupHandler", () => ({
  popuprHandler: vi.fn(),
}));

global.fetch = vi.fn();

describe("useSignupSubmit - 회원가입 제출", () => {
  const mockSetIsSubmitting = vi.fn();
  const mockData = {
    idRequired: "test@example.com",
    nickNameRequired: "testnick",
    passwordRequired: "password123",
    passwordConfirm: "password123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("폼이 유효하지 않으면 제출하지 않아야 한다", async () => {
    await handleSignupSubmit({
      data: mockData,
      isFormValid: false,
      isSubmitting: false,
      setIsSubmitting: mockSetIsSubmitting,
    });

    expect(mockSetIsSubmitting).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("이미 제출 중이면 중복 제출하지 않아야 한다", async () => {
    await handleSignupSubmit({
      data: mockData,
      isFormValid: true,
      isSubmitting: true,
      setIsSubmitting: mockSetIsSubmitting,
    });

    expect(mockSetIsSubmitting).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("회원가입 성공 시 성공 팝업을 표시해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    await handleSignupSubmit({
      data: mockData,
      isFormValid: true,
      isSubmitting: false,
      setIsSubmitting: mockSetIsSubmitting,
    });

    expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/signup"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: mockData.idRequired,
          nickname: mockData.nickNameRequired,
          password: mockData.passwordRequired,
          confirmPassword: mockData.passwordConfirm,
        }),
      })
    );
    expect(popuprHandler).toHaveBeenCalledWith({
      message: "회원가입이 완료되었습니다.",
      type: "alert",
    });
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  it("회원가입 실패 시 실패 팝업을 표시해야 한다", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed" }),
    } as Response);

    await handleSignupSubmit({
      data: mockData,
      isFormValid: true,
      isSubmitting: false,
      setIsSubmitting: mockSetIsSubmitting,
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "회원가입에 실패했습니다. 다시 시도해주세요.",
      type: "alert",
    });
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  it("custom onSubmit이 제공되면 그것을 사용해야 한다", async () => {
    const mockOnSubmit = vi.fn().mockResolvedValueOnce(undefined);

    await handleSignupSubmit({
      data: mockData,
      isFormValid: true,
      isSubmitting: false,
      setIsSubmitting: mockSetIsSubmitting,
      onSubmit: mockOnSubmit,
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(mockData);
    expect(fetch).not.toHaveBeenCalled();
  });
});
