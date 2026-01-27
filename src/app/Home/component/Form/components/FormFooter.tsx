import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useModalStore } from "@/store/modalStore";

type FormFooterProps = {
  mode: "create" | "edit" | "end";
  canStartTimer?: boolean;
  onStartTimer?: () => void;
  onSave?: () => void;
  onFinish?: () => void;
};

export function FormFooter({
  mode,
  canStartTimer,
  onStartTimer,
  onSave,
  onFinish,
}: FormFooterProps) {
  const closeModal = useModalStore((state) => state.closeTop);

  if (mode === "edit") {
    return (
      <div className="footer">
        <CommonButton theme="secondary" onClick={() => closeModal()}>
          취소
        </CommonButton>
        <CommonButton theme="primary" onClick={onSave}>
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
        <CommonButton theme="primary" onClick={onFinish}>
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
      <CommonButton
        theme={canStartTimer ? "primary" : "disable"}
        disabled={!canStartTimer}
        onClick={onStartTimer}
      >
        타이머 시작하기
      </CommonButton>
    </div>
  );
}
