import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useModalStore } from "@/store/modalStore";
import { FormMode } from "../types";

export function FormFooter({ mode }: { mode: FormMode }) {
  const closeModal = useModalStore((state) => state.closeTop);

  if (mode === "edit") {
    return (
      <div className="footer">
        <CommonButton theme="secondary" onClick={() => closeModal()}>
          취소
        </CommonButton>
        <CommonButton theme="primary" onClick={() => { }}>
          저장하기
        </CommonButton>
      </div>
    );
  }

  if (mode === "end") {
    return (
      <div className="footer">
        <CommonButton theme="secondary" onClick={() => closeModal()}>
          취소
        </CommonButton>
        <CommonButton theme="primary" onClick={() => { }}>
          공부 완료하기
        </CommonButton>
      </div>
    );
  }
  return (
    <div className="footer">
      <CommonButton theme="secondary" onClick={() => closeModal()}>
        취소
      </CommonButton>
      <CommonButton theme="primary" onClick={() => { }}>
        타이머 시작하기
      </CommonButton>
    </div>
  );
}
