export type ModalId = string;

export type ModalItem = {
  id: ModalId;

  title?: React.ReactNode; //   헤더 제목(선택)
  content: React.ReactNode; //   본문(필수)
  footer?: React.ReactNode; //   버튼/액션 영역(유동적)

  BackdropMiss?: boolean; //   배경 클릭 닫기
  showCloseButton?: boolean; //   상단 X 버튼 표시 여부

  testId?: string;

  width?: string | number; // 모달 너비

  onClose?: () => void; //   닫힐 때 후처리 콜백
};
