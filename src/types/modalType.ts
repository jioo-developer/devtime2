export type ModalId = string;

export type ModalItem = {
  id: ModalId;

  title?: React.ReactNode; //   헤더 제목(선택)
  content: React.ReactNode; //   본문(필수)
  footer?: React.ReactNode; //   버튼/액션 영역(유동적)

  BackdropMiss?: boolean; //   배경 클릭 닫기

  testId?: string;

  onClose?: () => void; //   닫힐 때 후처리 콜백
};
