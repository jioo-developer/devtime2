import { create } from "zustand";

// PopupMessageStore 상태 타입 정의
type PopupMessageStoreState = {
  message: string;
  type: "alert" | "confirm" | "prompt";
  callback?: () => void; // callback을 상태로 추가
  setMessage: (message: string) => void;
  setType: (type: "alert" | "confirm" | "prompt") => void;
  setCallback: (callback?: () => void) => void; // callback 설정 함수 추가
};

// Zustand store 생성
export const usePopupStore = create<PopupMessageStoreState>((set) => ({
  message: "",
  type: "alert", // 기본값 설정
  callback: undefined, // 초기에는 callback이 없음
  // 메시지 설정 함수
  setMessage: (message: string) => {
    set((state) => {
      if (state.message !== message) {
        return { message };
      }
      return state;
    });
  },

  // 타입 설정 함수
  setType: (type: "alert" | "confirm" | "prompt") => {
    set((state) => {
      if (state.type !== type) {
        return { type };
      }
      return state;
    });
  },

  // callback 설정 함수
  setCallback: (callback?: () => void) => {
    set((state) => {
      if (state.callback !== callback) {
        return { callback };
      }
      return state;
    });
  },
}));
