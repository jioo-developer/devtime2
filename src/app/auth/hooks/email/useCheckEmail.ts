import { useMutation } from "@tanstack/react-query";
import { UseFormSetError, UseFormClearErrors } from "react-hook-form";
import { authInputType } from "../../Client";
import { checkEmailDuplicate } from "./checkEmailApi";

interface CheckEmailParams {
  email: string;
  setError: UseFormSetError<authInputType>;
  clearErrors: UseFormClearErrors<authInputType>;
  setSuccessMessage: (message: string) => void;
}

export const useCheckEmailDuplicate = () => {
  return useMutation({
    mutationFn: checkEmailDuplicate,
    onSuccess: (data) => {
      console.log("이메일 중복 체크 성공:", data);
    },
    onError: (error) => {
      console.error("이메일 중복 체크 실패:", error);
    },
  });
};

export const handleCheckEmail = async ({
  email,
  setError,
  clearErrors,
  setSuccessMessage,
}: CheckEmailParams) => {
  setSuccessMessage("");

  if (!email) {
    setError("idRequired", {
      type: "manual",
      message: "이메일을 입력하세요.",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("idRequired", {
      type: "manual",
      message: "이메일 형식으로 작성해 주세요.",
    });
    return;
  }

  try {
    const response = await checkEmailDuplicate(email);
    console.log(response);
    if (!response.available) {
      setError("idRequired", {
        type: "manual",
        message: response.message,
      });
    } else {
      clearErrors("idRequired");
      setSuccessMessage("사용 가능한 이메일입니다.");
    }
  } catch {
    setError("idRequired", {
      type: "manual",
      message: "이메일 중복 체크에 실패했습니다.",
    });
  }
};
