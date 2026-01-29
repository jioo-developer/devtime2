"use client";

import { useModalStore } from "@/store/modalStore";
import React, { useEffect } from "react";
import UIModalBase from "./CommonModal";
// 파일명이 UIModalBase.tsx인데 import가 "./CommonModal"이면 네이밍/경로가 혼재 상태
// (동작은 하겠지만 컨벤션 관점에서 정리 필요)

const BASE_Z = 1000; //   모달 기본 z-index
const GAP_Z = 10; //   스택이 늘어날 때마다 z-index 증가폭

export default function UIModalStack() {
  //   Zustand store에서 stack/close/closeTop을 가져옴
  const stack = useModalStore((state) => state.stack);
  const close = useModalStore((state) => state.close);

  /**
   * Scroll Lock
   * - 모달이 하나라도 있으면 body 스크롤 막기
   * - 모달이 모두 사라지면 overflow 원복
   */
  useEffect(() => {
    if (stack.length === 0) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [stack.length]);

  //   스택이 비어있으면 렌더할 게 없으므로 null
  if (stack.length === 0) return null;

  //   스택에 있는 모달을 모두 렌더 (동시에 여러개 뜨는 구조)
  return (
    <>
      {stack.map((modal, index) => {
        const isTop = index === stack.length - 1;

        return (
          <UIModalBase
            key={modal.id}
            title={modal.title}
            footer={modal.footer}
            testId={modal.testId}
            BackdropMiss={modal.BackdropMiss ?? true}
            showCloseButton={modal.showCloseButton}
            onRequestClose={() => close(modal.id)} //   닫기 요청 -> store에서 제거
            isTop={isTop} //   top 여부 전달
            zIndex={BASE_Z + index * GAP_Z} //   스택 순서대로 위로 쌓기
            width={modal.width}
          >
            {modal.content}
          </UIModalBase>
        );
      })}
    </>
  );
}
