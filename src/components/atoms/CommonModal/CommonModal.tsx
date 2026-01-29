"use client";
import React from "react";
import { createPortal } from "react-dom";
import styles from "./UIModalBase.module.css";

//   모달 껍데기(원자) 컴포넌트가 받는 props 정의
export type UIModalBaseProps = {
  title?: React.ReactNode; // 헤더 타이틀(없으면 생략 가능)
  children: React.ReactNode; // 본문 내용(필수)
  footer?: React.ReactNode; // 푸터(버튼들, 동적 개수 가능)
  onRequestClose: () => void; //  "닫아줘" 요청만 통지 (실제 close는 store가 함)
  BackdropMiss: boolean; // 배경 클릭으로 닫기 허용 여부
  showCloseButton?: boolean; // 상단 X 버튼 표시 여부
  isTop: boolean; //   스택에서 최상단 모달인지 여부
  zIndex: number; //   스택 쌓임 순서를 위한 z-index
  testId?: string; // 테스트용 식별자
  width?: string | number; // 모달 너비
  height?: string | number; // 모달 높이 (지정 시 고정, 없으면 콘텐츠에 맞게)
};

export default function UIModalBase({
  title,
  children,
  footer,
  onRequestClose,
  BackdropMiss,
  showCloseButton = true,
  isTop,
  zIndex,
  testId,
  width,
  height,
}: UIModalBaseProps) {
  //   SSR 환경(서버)에서는 document/body가 없으므로 렌더를 막음
  if (typeof window === "undefined") return null;

  //   Portal로 document.body에 붙여서 렌더(overflow/z-index 이슈 회피)
  return createPortal(
    <div
      className={`${styles.modalRoot} modal`}
      style={{ zIndex }}
      data-testid={testId}
      aria-hidden={!isTop} //   top이 아닌 모달은 접근성 관점에서 "숨김" 처리
    >
      {/*   Backdrop(배경): "top 모달만" 클릭 허용 */}
      <div
        className={styles.backdrop}
        style={{ pointerEvents: isTop ? "auto" : "none" }} //   back miss 처리(아래 모달은 클릭 무시)
        onClick={() => {
          if (!isTop) return; //   top이 아니면 어떤 경우에도 무시
          if (!BackdropMiss) return; //   옵션으로 배경 닫기 금지 가능
          onRequestClose(); //   닫기 "요청"만 올림 (실제 제거는 store에서)
        }}
      />

      {/*   Panel(실제 모달 박스): 역시 top만 포인터 허용 */}
      <div
        className={styles.panel}
        style={{
          pointerEvents: isTop ? "auto" : "none", //   아래 모달 클릭 불가
          ...(width && { width: typeof width === "number" ? `${width}px` : width }),
          ...(height && { height: typeof height === "number" ? `${height}px` : height }),
        }}
        role="dialog" //   접근성 기본
        aria-modal={isTop ? "true" : undefined} //   top만 modal 취급
      >
        {/*   제목이 있거나 X버튼이 표시되어야 하면 header 표시 */}
        {(title != null || (showCloseButton && isTop)) && (
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>

            {/*   X 버튼: showCloseButton이 true이고 top에서만 동작 */}
            {showCloseButton && (
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => {
                  if (!isTop) return; //   top이 아니면 무시
                  onRequestClose(); //   닫기 요청
                }}
                aria-label="close"
                disabled={!isTop} //   top이 아니면 버튼도 비활성
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/*   본문 */}
        <div className={styles.body}>{children}</div>

        {/*   푸터: 버튼 개수/구성이 유동적이어도 ReactNode로 그대로 받음 */}
        {footer != null && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body, //   최종 포탈 위치
  );
}
