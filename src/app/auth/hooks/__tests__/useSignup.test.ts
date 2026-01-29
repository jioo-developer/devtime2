import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSignup } from "../useSignup";
import { createTestQueryClient, createWrapper } from "./test-utils";
import { ApiClient } from "@/config/apiConfig";

vi.mock("@/config/apiConfig", () => ({
  ApiClient: {
    post: vi.fn(),
  },
}));

describe("useSignup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("회원가입에 성공하면 isSuccess가 true가 된다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    const mockResponse = {
      success: true,
      message: "회원가입이 완료되었습니다.",
    };

    vi.mocked(ApiClient.post).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useSignup(), { wrapper });

    const signupData = {
      email: "test@example.com",
      nickname: "테스트유저",
      password: "password123!",
      passwordConfirmation: "password123!",
      agreedToTermsAndPrivacy: true,
      agreedToMarketing: false,
    };

    result.current.mutate(signupData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(ApiClient.post).toHaveBeenCalledWith("/api/signup", {
      email: "test@example.com",
      nickname: "테스트유저",
      password: "password123!",
      confirmPassword: "password123!",
    });
  });

  it("회원가입 실패 시 isError가 true가 된다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    const mockError = new Error("회원가입에 실패했습니다.");
    vi.mocked(ApiClient.post).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSignup(), { wrapper });

    const signupData = {
      email: "test@example.com",
      nickname: "테스트유저",
      password: "password123!",
      passwordConfirmation: "password123!",
      agreedToTermsAndPrivacy: true,
      agreedToMarketing: false,
    };

    result.current.mutate(signupData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it("폼 데이터를 올바른 API 형식으로 변환한다", async () => {
    const queryClient = createTestQueryClient();
    const wrapper = createWrapper(queryClient);

    vi.mocked(ApiClient.post).mockResolvedValueOnce({ success: true });

    const { result } = renderHook(() => useSignup(), { wrapper });

    const signupData = {
      email: "newuser@example.com",
      nickname: "신규유저",
      password: "securePass123!",
      passwordConfirmation: "securePass123!",
      agreedToTermsAndPrivacy: true,
      agreedToMarketing: true,
    };

    result.current.mutate(signupData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(ApiClient.post).toHaveBeenCalledWith("/api/signup", {
      email: "newuser@example.com",
      nickname: "신규유저",
      password: "securePass123!",
      confirmPassword: "securePass123!",
    });
  });
});
