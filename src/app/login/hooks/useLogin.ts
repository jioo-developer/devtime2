import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import type { LoginData, LoginResponse } from "../types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginData) => {
      const payload = {
        email: data.email,
        password: data.password,
      };
      return ApiClient.post<LoginResponse>("/api/auth/login", payload);
    },
  });
};
