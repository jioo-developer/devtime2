import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { CheckDuplicateResponse, UseChecValidationlParams } from "./hookTypes";

export const useCheckEmail = ({
  setError,
  clearErrors,
  setSuccessMessage,
}: UseChecValidationlParams) => {
  return useMutation({
    mutationFn: (email: string) =>
      ApiClient.get<CheckDuplicateResponse>("/api/signup/check-email", {
        email,
      }),
    onSuccess: (data) => {
      if (!data.available) {
        setError("email", {
          type: "manual",
          message: data.message,
        });
      } else {
        clearErrors("email");
        setSuccessMessage("사용 가능한 이메일입니다.");
      }
    },
    onError: () => {
      setError("email", {
        type: "manual",
        message: "이메일 중복 체크에 실패했습니다.",
      });
    },
  });
};
