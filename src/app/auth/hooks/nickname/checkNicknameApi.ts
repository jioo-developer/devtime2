import { ApiClient, ApiEndpoints } from "@/config/apiConfig";

export interface CheckDuplicateResponse {
  success: boolean;
  available: boolean;
  message: string;
}

export const checkNicknameDuplicate = async (
  nickname: string
): Promise<CheckDuplicateResponse> => {
  const response = await fetch(
    `${ApiClient.config.baseUrl}${
      ApiEndpoints.signup.checkNickname
    }?nickname=${encodeURIComponent(nickname)}`,
    {
      method: "GET",
      headers: ApiClient.config.headers,
    }
  );

  if (!response.ok) {
    throw new Error("닉네임 중복 체크에 실패했습니다.");
  }

  return response.json();
};
