import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { useRouter, useSearchParams } from "next/navigation";

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  isFirstLogin: boolean;
  isDuplicateLogin: boolean;
};

function safeInternalPath(value: string | null) {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.includes("\\")) return null;
  return value;
}

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
      console.log("로그인 성공:", result);

      if (result.success) {
        if (result.accessToken) {
          localStorage.setItem("accessToken", result.accessToken);
        }
        if (result.refreshToken) {
          localStorage.setItem("refreshToken", result.refreshToken);
        }

        const redirectParam = safeInternalPath(searchParams.get("redirect"));
        router.replace(redirectParam ?? "/");
      }
    },
    onError: (error) => {
      console.error("로그인 오류:", error);
    },
  });
};
