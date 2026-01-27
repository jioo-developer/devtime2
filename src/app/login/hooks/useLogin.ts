import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { handleNormalLogin } from "./handleLogin";
import { handleDuplicateLogin } from "./handleDuplicateLogin";
import { handleLoginError } from "./handleLoginError";
import type { LoginData, LoginResponse } from "./types";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (data: LoginData) => {
      const payload = {
        email: data.email,
        password: data.password,
      };
      return ApiClient.post<LoginResponse>("/api/auth/login", payload);
    },
    onSuccess: (result) => {
      if (result.success) {
        // 중복 로그인 처리
        if (result.isDuplicateLogin) {
          handleDuplicateLogin(result, router, searchParams);
        } else {
          // 일반 로그인 처리
          handleNormalLogin(result, router, searchParams);
        }
      }
    },
    onError: () => {
      handleLoginError();
    },
  });
};
