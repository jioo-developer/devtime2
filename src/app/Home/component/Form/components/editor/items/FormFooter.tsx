import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { useModalStore } from "@/store/modalStore";

type CreateModeFooterProps = {
  mode: "create";
  canStartTimer: boolean;
  onStartTimer: () => void;
};

type EditModeFooterProps = {
  mode: "edit";
  onSave: () => void;
};

type EndModeFooterProps = {
  mode: "end";
  onFinish: () => void;
};

type ResetModeFooterProps = {
  mode: "reset";
  onReset: () => void;
};

type FormFooterProps = CreateModeFooterProps | EditModeFooterProps | EndModeFooterProps | ResetModeFooterProps;

export function FormFooter(props: FormFooterProps) {
  const closeModal = useModalStore((state) => state.closeTop);

  if (props.mode === "edit") {
    return (
      <div className="footer">
        <CommonButton theme="secondary" onClick={() => closeModal()}>
          취소
        </CommonButton>
        <CommonButton theme="primary" onClick={props.onSave}>
          저장하기
        </CommonButton>
      </div>
    );
  }

  if (props.mode === "end") {
    return (
      <div className="footer">
        <CommonButton theme="secondary" onClick={() => closeModal()}>
          취소
        </CommonButton>
        <CommonButton theme="primary" onClick={props.onFinish}>
          공부 완료하기
        </CommonButton>
      </div>
    );
  }

  if (props.mode === "reset") {
    return (
      <div className="footer">
        <CommonButton theme="secondary" onClick={() => closeModal()}>
          취소
        </CommonButton>
        <CommonButton theme="primary" onClick={props.onReset}>
          초기화하기
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
        theme={props.canStartTimer ? "primary" : "disable"}
        disabled={!props.canStartTimer}
        onClick={props.onStartTimer}
      >
        타이머 시작하기
      </CommonButton>
    </div>
  );
}
