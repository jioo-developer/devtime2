import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/config/apiConfig";
import { CheckDuplicateResponse, UseChecValidationlParams } from "./hookTypes";

export const useCheckNickname = ({
  setError,
  clearErrors,
  setSuccessMessage,
}: UseChecValidationlParams) => {
  return useMutation({
    mutationFn: (nickname: string) =>
      ApiClient.get<CheckDuplicateResponse>("/api/signup/check-nickname", {
        nickname,
      }),
    onSuccess: (data) => {
      if (!data.available) {
        setError("nickname", {
          type: "manual",
          message: data.message || "이미 사용 중인 닉네임입니다.",
        });
      } else {
        clearErrors("nickname");
        setSuccessMessage("사용 가능한 닉네임입니다.");
      }
    },
    onError: () => {
      setError("nickname", {
        type: "manual",
        message: "닉네임 중복 체크에 실패했습니다.",
      });
    },
  });
};
