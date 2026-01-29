import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import type { AuthFormData } from "../types";

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: AuthFormData) => {
      const payload = {
        email: data.email,
        nickname: data.nickname,
        password: data.password,
        confirmPassword: data.passwordConfirmation,
      };
      return ApiClient.post("/api/signup", payload);
    },
  });
};
