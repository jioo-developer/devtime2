"use client";

import { create } from "zustand";
import type { ModalId, ModalItem } from "../types/modalType";

/**
 *   store가 제공하는 API
 * - stack: 현재 열린 모달 리스트(= 스택)
 * - push: 모달 추가(열기)
 * - close: 특정 id 제거(닫기)
 * - closeTop: 최상단 하나 제거
 * - clear: 전체 제거
 */
type ModalState = {
  stack: ModalItem[];

  push: (item: Omit<ModalItem, "id"> & { id?: ModalId }) => ModalId;
  close: (id: ModalId) => void;
  closeTop: () => void;
  clear: () => void;
};

//   모달 id 생성기: crypto.randomUUID가 있으면 그걸 쓰고, 없으면 fallback 문자열 생성
const genId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `modal_${Date.now()}_${Math.random().toString(16).slice(2)}`) as ModalId;

export const useModalStore = create<ModalState>((set, get) => ({
  //   초기에는 열린 모달이 없음
  stack: [],

  /**
   *   push: 모달 열기
   * - id가 없으면 생성
   * - 기본 옵션(closeOnBackdrop true)을 깔고 item으로 덮어씀
   * - stack 배열 맨 뒤에 추가(= top)
   */
  push: (item) => {
    const id = item.id ?? genId();

    const next: ModalItem = {
      id,
      BackdropMiss: true, //   기본값
      ...item, //   전달값이 기본값을 덮어씀
    };

    set((state) => ({ stack: [...state.stack, next] }));
    return id;
  },

  /**
   *   close: 특정 모달 닫기
   * - 먼저 해당 모달을 찾아서 onClose 콜백 실행(있으면)
   * - 그 후 stack에서 필터링으로 제거
   */
  close: (id) => {
    const target = get().stack.find((modal) => modal.id === id);
    if (target?.onClose) target.onClose();

    set((state) => ({
      stack: state.stack.filter((modal) => modal.id !== id),
    }));
  },

  /**
   *   closeTop: 최상단 모달 하나 닫기
   * - 마지막 요소를 찾아 onClose 호출
   * - slice로 마지막 요소 제거
   */
  closeTop: () => {
    const stack = get().stack;
    if (stack.length === 0) return;

    const top = stack[stack.length - 1];
    if (top.onClose) top.onClose();

    set((state) => ({ stack: state.stack.slice(0, -1) }));
  },

  /**
   *   clear: 전체 닫기
   * - 모든 모달 onClose 호출
   * - stack 초기화
   */
  clear: () => {
    const stack = get().stack;
    stack.forEach((modal) => modal.onClose?.());
    set({ stack: [] });
  },
}));
