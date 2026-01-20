// 이메일

import { UseFormClearErrors, UseFormSetError } from "react-hook-form";
import { AuthFormData } from "../Client";
import { ApiClient } from "@/config/apiConfig";

interface CheckEmailType {
  email: string;
  setError: UseFormSetError<AuthFormData>;
  clearErrors: UseFormClearErrors<AuthFormData>;
  setSuccessMessage: (message: string) => void;
}

export const handleCheckEmail = async ({
  email,
  setError,
  clearErrors,
  setSuccessMessage,
}: CheckEmailType) => {
  setSuccessMessage("");

  if (!email) {
    setError("email", {
      type: "manual",
      message: "이메일을 입력하세요.",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("email", {
      type: "manual",
      message: "이메일 형식으로 작성해 주세요.",
    });
    return;
  }

  try {
    const response = await checkDuplicate({
      endpoint: "/api/signup/check-email",
      queryKey: "email",
      value: email,
      errorMessage: "이메일 중복 체크에 실패했습니다.",
    });
    console.log(response);
    if (!response.available) {
      setError("email", {
        type: "manual",
        message: response.message,
      });
    } else {
      clearErrors("email");
      setSuccessMessage("사용 가능한 이메일입니다.");
    }
  } catch {
    setError("email", {
      type: "manual",
      message: "이메일 중복 체크에 실패했습니다.",
    });
  }
};

// 닉네임

interface CheckNicknameType {
  nickname: string;
  setError: UseFormSetError<AuthFormData>;
  clearErrors: UseFormClearErrors<AuthFormData>;
  setSuccessMessage: (message: string) => void;
}

export const handleCheckNickname = async ({
  nickname,
  setError,
  clearErrors,
  setSuccessMessage,
}: CheckNicknameType) => {
  setSuccessMessage("");

  if (!nickname) {
    setError("nickname", {
      type: "manual",
      message: "닉네임을 입력하세요.",
    });
    return;
  }

  if (nickname.length < 2 || nickname.length > 10) {
    setError("nickname", {
      type: "manual",
      message: "닉네임은 2-10자로 입력해 주세요.",
    });
    return;
  }

  try {
    const response = await checkDuplicate({
      endpoint: "/api/signup/check-nickname",
      queryKey: "nickname",
      value: nickname,
      errorMessage: "닉네임 중복 체크에 실패했습니다.",
    });

    if (!response.available) {
      setError("nickname", {
        type: "manual",
        message: response.message || "이미 사용 중인 닉네임입니다.",
      });
    } else {
      clearErrors("nickname");
      setSuccessMessage("사용 가능한 닉네임입니다.");
    }
  } catch {
    setError("nickname", {
      type: "manual",
      message: "닉네임 중복 체크에 실패했습니다.",
    });
  }
};

type Params = {
  endpoint: string;
  queryKey: string;
  value: string;
  errorMessage: string;
};

export interface CheckDuplicateResponse {
  success: boolean;
  available: boolean;
  message: string;
}

// 중복 확인을 하기위한 API 요청을 보내는 함수

export async function checkDuplicate({
  endpoint,
  queryKey,
  value,
  errorMessage,
}: Params): Promise<CheckDuplicateResponse> {
  const response = await fetch(
    `${ApiClient.config.baseUrl}${endpoint}?${queryKey}=${encodeURIComponent(
      value,
    )}`,
    {
      method: "GET",
      headers: ApiClient.config.headers,
    },
  );

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
}
