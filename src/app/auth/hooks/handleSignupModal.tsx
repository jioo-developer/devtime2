import { useModalStore } from "@/store/modalStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useRouter } from "next/navigation";

export const handleSignupSuccess = (router: ReturnType<typeof useRouter>) => {
  const push = useModalStore.getState().push;
  const closeTop = useModalStore.getState().closeTop;
  push({
    title: "회원가입 성공",
    content: "회원가입이 완료되었습니다.",
    footer: (
      <CommonButton
        theme="primary"
        onClick={() => {
          closeTop();
          router.push("/login");
        }}
      >
        확인
      </CommonButton>
    ),
    BackdropMiss: false,
  });
};

export const handleSignupError = (error: Error | unknown) => {
  const push = useModalStore.getState().push;
  const closeTop = useModalStore.getState().closeTop;
  const errorMessage =
    error instanceof Error
      ? error.message
      : "회원가입 중 오류가 발생했습니다.";
  push({
    title: "회원가입 실패",
    content: errorMessage,
    footer: (
      <CommonButton theme="primary" onClick={() => closeTop()}>
        확인
      </CommonButton>
    ),
    BackdropMiss: false,
  });
};
