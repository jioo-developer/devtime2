import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleCheckNickname } from "../hooks/nickname/useCheckNickname";
import { checkNicknameDuplicate } from "../hooks/nickname/checkNicknameApi";

// Mock API
vi.mock("../hooks/nickname/checkNicknameApi", () => ({
  checkNicknameDuplicate: vi.fn(),
}));

describe("useCheckNickname - 닉네임 중복 체크", () => {
  const mockSetError = vi.fn();
  const mockClearErrors = vi.fn();
  const mockSetSuccessMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("닉네임이 비어있으면 에러 메시지를 설정해야 한다", async () => {
    await handleCheckNickname({
      nickname: "",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockSetError).toHaveBeenCalledWith("nickNameRequired", {
      type: "manual",
      message: "닉네임을 입력하세요.",
    });
  });

  it("닉네임이 2자 미만이면 에러 메시지를 설정해야 한다", async () => {
    await handleCheckNickname({
      nickname: "a",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockSetError).toHaveBeenCalledWith("nickNameRequired", {
      type: "manual",
      message: "닉네임은 2-10자로 입력해 주세요.",
    });
  });

  it("닉네임이 10자 초과이면 에러 메시지를 설정해야 한다", async () => {
    await handleCheckNickname({
      nickname: "12345678901",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockSetError).toHaveBeenCalledWith("nickNameRequired", {
      type: "manual",
      message: "닉네임은 2-10자로 입력해 주세요.",
    });
  });

  it("사용 가능한 닉네임이면 성공 메시지를 설정해야 한다", async () => {
    vi.mocked(checkNicknameDuplicate).mockResolvedValueOnce({
      success: true,
      available: true,
      message: "사용 가능한 닉네임입니다.",
    });

    await handleCheckNickname({
      nickname: "testnick",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockClearErrors).toHaveBeenCalledWith("nickNameRequired");
    expect(mockSetSuccessMessage).toHaveBeenCalledWith(
      "사용 가능한 닉네임입니다."
    );
  });

  it("중복된 닉네임이면 에러 메시지를 설정해야 한다", async () => {
    vi.mocked(checkNicknameDuplicate).mockResolvedValueOnce({
      success: true,
      available: false,
      message: "이미 사용 중인 닉네임입니다.",
    });

    await handleCheckNickname({
      nickname: "duplicate",
      setError: mockSetError,
      clearErrors: mockClearErrors,
      setSuccessMessage: mockSetSuccessMessage,
    });

    expect(mockSetError).toHaveBeenCalledWith("nickNameRequired", {
      type: "manual",
      message: "이미 사용 중인 닉네임입니다.",
    });
  });
});
