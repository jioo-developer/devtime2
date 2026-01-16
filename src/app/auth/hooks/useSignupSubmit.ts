import { authInputType } from "../Client";
import { ApiClient, ApiEndpoints } from "@/config/apiConfig";
import { popuprHandler } from "@/utils/popupHandler";

interface HandleSignupParams {
  data: authInputType;
  isFormValid: boolean;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onSubmit?: (data: authInputType) => Promise<void>;
}

export const handleSignupSubmit = async ({
  data,
  isFormValid,
  isSubmitting,
  setIsSubmitting,
  onSubmit,
}: HandleSignupParams) => {
  if (!isFormValid || isSubmitting) return;

  setIsSubmitting(true);
  try {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      // 기본 회원가입 API 호출
      const response = await fetch(
        `${ApiClient.config.baseUrl}${ApiEndpoints.signup.register}`,
        {
          method: "POST",
          headers: ApiClient.config.headers,
          body: JSON.stringify({
            email: data.idRequired,
            nickname: data.nickNameRequired,
            password: data.passwordRequired,
            confirmPassword: data.passwordConfirm,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.");
      }

      const result = await response.json();
      console.log("회원가입 성공:", result);
      popuprHandler({
        message: "회원가입이 완료되었습니다.",
        type: "alert",
      });
    }
  } catch (error) {
    console.error("회원가입 오류:", error);
    popuprHandler({
      message: "회원가입에 실패했습니다. 다시 시도해주세요.",
      type: "alert",
    });
  } finally {
    setIsSubmitting(false);
  }
};
