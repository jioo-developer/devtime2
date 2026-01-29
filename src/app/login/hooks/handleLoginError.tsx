import { useModalStore } from "@/store/modalStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

export const handleLoginError = () => {
  const openModal = useModalStore.getState().push;
  const closeModal = useModalStore.getState().closeTop;

  openModal({
    title: "로그인 실패",
    content: "로그인 정보를 다시 확인해 주세요.",
    footer: (
      <CommonButton
        theme="primary"
        onClick={() => {
          closeModal();
          setTimeout(() => {
            const emailInput = document.querySelector(
              '[data-testid="email-input"]',
            ) as HTMLInputElement;
            emailInput?.focus();
          }, 0);
        }}
      >
        확인
      </CommonButton>
    ),
    BackdropMiss: false,
    onClose: () => {
      setTimeout(() => {
        const emailInput = document.querySelector(
          '[data-testid="email-input"]',
        ) as HTMLInputElement;
        emailInput?.focus();
      }, 0);
    },
  });
};
