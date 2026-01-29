import { useModalStore } from "@/store/modalStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useRouter, useSearchParams } from "next/navigation";
import { setTokens } from "@/config/utils/tokenStorage";
import { safeInternalPath } from "@/utils/pathUtils";
import type { LoginResponse } from "../types";

export const handleDuplicateLogin = (
  result: LoginResponse,
  router: ReturnType<typeof useRouter>,
  searchParams: ReturnType<typeof useSearchParams>,
) => {
  const openModal = useModalStore.getState().push;
  const closeModal = useModalStore.getState().closeTop;

  openModal({
    title: "중복 로그인",
    content: "다른 기기에서 로그인되어 기존 기기의 로그인이 해제되었습니다.",
    footer: (
      <CommonButton
        theme="primary"
        onClick={() => {
          closeModal();
          setTokens(result.accessToken, result.refreshToken);
          if (result.isFirstLogin) {
            router.replace("/profile");
          } else {
            const redirectParam = safeInternalPath(
              searchParams.get("redirect"),
            );
            router.replace(redirectParam ?? "/");
          }
        }}
      >
        확인
      </CommonButton>
    ),
    BackdropMiss: false,
  });
};
