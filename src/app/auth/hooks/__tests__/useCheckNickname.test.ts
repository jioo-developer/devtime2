import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCheckNickname } from "../useCheckNickname";
import { createTestQueryClient, createWrapper } from "./test-utils";
import { ApiClient } from "@/config/apiConfig";

vi.mock("@/config/apiConfig", () => ({
  ApiClient: {
    get: vi.fn(),
  },
}));

describe("useCheckNickname", () => {
  const mockSetError = vi.fn();
  const mockClearErrors = vi.fn();
  const mockSetSuccessMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("닉네임이 사용 가능할 때 성공 메시지를 표시한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: true,
      available: true,
      message: "사용 가능한 닉네임입니다.",
    });

    const { result } = renderHook(
      () =>
        useCheckNickname({
          setError: mockSetError,
          clearErrors: mockClearErrors,
          setSuccessMessage: mockSetSuccessMessage,
        }),
      { wrapper },
    );

    result.current.mutate("테스트닉네임");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(ApiClient.get).toHaveBeenCalledWith("/api/signup/check-nickname", {
      nickname: "테스트닉네임",
    });
    expect(mockClearErrors).toHaveBeenCalledWith("nickname");
    expect(mockSetSuccessMessage).toHaveBeenCalledWith(
      "사용 가능한 닉네임입니다.",
    );
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("닉네임이 중복일 때 에러를 표시한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: false,
      available: false,
      message: "이미 사용 중인 닉네임입니다.",
    });

    const { result } = renderHook(
      () =>
        useCheckNickname({
          setError: mockSetError,
          clearErrors: mockClearErrors,
          setSuccessMessage: mockSetSuccessMessage,
        }),
      { wrapper },
    );

    result.current.mutate("중복닉네임");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSetError).toHaveBeenCalledWith("nickname", {
      type: "manual",
      message: "이미 사용 중인 닉네임입니다.",
    });
    expect(mockClearErrors).not.toHaveBeenCalled();
    expect(mockSetSuccessMessage).not.toHaveBeenCalled();
  });

  it("응답에 메시지가 없을 때 기본 에러 메시지를 표시한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: false,
      available: false,
      message: "",
    });

    const { result } = renderHook(
      () =>
        useCheckNickname({
          setError: mockSetError,
          clearErrors: mockClearErrors,
          setSuccessMessage: mockSetSuccessMessage,
        }),
      { wrapper },
    );

    result.current.mutate("중복닉네임");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSetError).toHaveBeenCalledWith("nickname", {
      type: "manual",
      message: "이미 사용 중인 닉네임입니다.",
    });
  });

  it("API 호출 실패 시 에러를 표시한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(
      () =>
        useCheckNickname({
          setError: mockSetError,
          clearErrors: mockClearErrors,
          setSuccessMessage: mockSetSuccessMessage,
        }),
      { wrapper },
    );

    result.current.mutate("테스트닉네임");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockSetError).toHaveBeenCalledWith("nickname", {
      type: "manual",
      message: "닉네임 중복 체크에 실패했습니다.",
    });
  });
});
