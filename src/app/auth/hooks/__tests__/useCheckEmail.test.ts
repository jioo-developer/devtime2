import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCheckEmail } from "../useCheckEmail";
import { createTestQueryClient, createWrapper } from "./test-utils";
import { ApiClient } from "@/config/apiConfig";

vi.mock("@/config/apiConfig", () => ({
  ApiClient: {
    get: vi.fn(),
  },
}));

describe("useCheckEmail", () => {
  const mockSetError = vi.fn();
  const mockClearErrors = vi.fn();
  const mockSetSuccessMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("이메일이 사용 가능할 때 성공 메시지를 표시한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: true,
      available: true,
      message: "사용 가능한 이메일입니다.",
    });

    const { result } = renderHook(
      () =>
        useCheckEmail({
          setError: mockSetError,
          clearErrors: mockClearErrors,
          setSuccessMessage: mockSetSuccessMessage,
        }),
      { wrapper },
    );

    result.current.mutate("test@example.com");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(ApiClient.get).toHaveBeenCalledWith("/api/signup/check-email", {
      email: "test@example.com",
    });
    expect(mockClearErrors).toHaveBeenCalledWith("email");
    expect(mockSetSuccessMessage).toHaveBeenCalledWith(
      "사용 가능한 이메일입니다.",
    );
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it("이메일이 중복일 때 에러를 표시한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockResolvedValueOnce({
      success: false,
      available: false,
      message: "이미 사용 중인 이메일입니다.",
    });

    const { result } = renderHook(
      () =>
        useCheckEmail({
          setError: mockSetError,
          clearErrors: mockClearErrors,
          setSuccessMessage: mockSetSuccessMessage,
        }),
      { wrapper },
    );

    result.current.mutate("duplicate@example.com");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockSetError).toHaveBeenCalledWith("email", {
      type: "manual",
      message: "이미 사용 중인 이메일입니다.",
    });
    expect(mockClearErrors).not.toHaveBeenCalled();
    expect(mockSetSuccessMessage).not.toHaveBeenCalled();
  });

  it("API 호출 실패 시 에러를 표시한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.get).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(
      () =>
        useCheckEmail({
          setError: mockSetError,
          clearErrors: mockClearErrors,
          setSuccessMessage: mockSetSuccessMessage,
        }),
      { wrapper },
    );

    result.current.mutate("test@example.com");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockSetError).toHaveBeenCalledWith("email", {
      type: "manual",
      message: "이메일 중복 체크에 실패했습니다.",
    });
  });
});
