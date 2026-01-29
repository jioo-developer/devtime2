"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/config/utils/tokenStorage";
import { useModalStore } from "@/store/modalStore";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";

/** 로그인 여부. accessToken 존재 여부로 판단. isReady는 클라이언트에서 한 번 확인된 뒤 true (SSR/초기에는 false). */
export function useIsLoggedIn(): {
  isLoggedIn: boolean;
  isReady: boolean;
} {
  const [state, setState] = useState({ isLoggedIn: false, isReady: false });

  useEffect(() => {
    setState({ isLoggedIn: !!getAccessToken(), isReady: true });
  }, []);

  return state;
}

/**
 * 비로그인일 때 "로그인 필요" 모달을 띄운다. isReady일 때만 열어서 SSR/하이드레이션 직후 오탐을 막는다.
 * 버튼 클릭 시 모달 닫고 /login으로 이동.
 */
export function useLoginRequiredModal(isLoggedIn: boolean, isReady: boolean) {
  const router = useRouter();
  const pushModal = useModalStore((s) => s.push);
  const closeTop = useModalStore((s) => s.closeTop);

  const openLoginRequiredModal = useCallback(() => {
    pushModal({
      width: 360,
      title: "로그인 필요",
      content: "로그인이 필요한 서비스입니다.",
      showCloseButton: false,
      BackdropMiss: true,
      footer: (
        <CommonButton
          theme="primary"
          onClick={() => {
            closeTop();
            router.push("/login");
          }}
        >
          로그인 하러가기
        </CommonButton>
      ),
    });
  }, [pushModal, closeTop, router]);

  useEffect(() => {
    if (isReady && !isLoggedIn) openLoginRequiredModal();
  }, [isReady, isLoggedIn, openLoginRequiredModal]);
}
