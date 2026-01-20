import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { AuthFormData } from "../Client";

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
    onSuccess: (result) => {
      console.log("회원가입 성공:", result);
    },
    onError: (error) => {
      console.error("회원가입 오류:", error);
    },
  });
};
