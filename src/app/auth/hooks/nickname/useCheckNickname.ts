import { useMutation } from "@tanstack/react-query";
import { UseFormSetError, UseFormClearErrors } from "react-hook-form";
import { authInputType } from "../../Client";
import { checkNicknameDuplicate } from "./checkNicknameApi";

interface CheckNicknameParams {
  nickname: string;
  setError: UseFormSetError<authInputType>;
  clearErrors: UseFormClearErrors<authInputType>;
  setSuccessMessage: (message: string) => void;
}

export const useCheckNicknameDuplicate = () => {
  return useMutation({
    mutationFn: checkNicknameDuplicate,
    onSuccess: (data) => {
      console.log("닉네임 중복 체크 성공:", data);
    },
    onError: (error) => {
      console.error("닉네임 중복 체크 실패:", error);
    },
  });
};

export const handleCheckNickname = async ({
  nickname,
  setError,
  clearErrors,
  setSuccessMessage,
}: CheckNicknameParams) => {
  setSuccessMessage("");

  if (!nickname) {
    setError("nickNameRequired", {
      type: "manual",
      message: "닉네임을 입력하세요.",
    });
    return;
  }

  if (nickname.length < 2 || nickname.length > 10) {
    setError("nickNameRequired", {
      type: "manual",
      message: "닉네임은 2-10자로 입력해 주세요.",
    });
    return;
  }

  try {
    const response = await checkNicknameDuplicate(nickname);

    if (!response.available) {
      setError("nickNameRequired", {
        type: "manual",
        message: response.message || "이미 사용 중인 닉네임입니다.",
      });
    } else {
      clearErrors("nickNameRequired");
      setSuccessMessage("사용 가능한 닉네임입니다.");
    }
  } catch {
    setError("nickNameRequired", {
      type: "manual",
      message: "닉네임 중복 체크에 실패했습니다.",
    });
  }
};
