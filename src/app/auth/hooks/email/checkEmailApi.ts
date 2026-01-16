import { ApiClient, ApiEndpoints } from "@/config/apiConfig";

export interface CheckDuplicateResponse {
  success: boolean;
  available: boolean;
  message: string;
}

export const checkEmailDuplicate = async (
  email: string
): Promise<CheckDuplicateResponse> => {
  const response = await fetch(
    `${ApiClient.config.baseUrl}${
      ApiEndpoints.signup.checkEmail
    }?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: ApiClient.config.headers,
    }
  );

  if (!response.ok) {
    throw new Error("이메일 중복 체크에 실패했습니다.");
  }

  return response.json();
};
