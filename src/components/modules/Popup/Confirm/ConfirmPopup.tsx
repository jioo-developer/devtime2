import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonPopup from "@/components/atoms/CommonPopup/CommonPopup";
import { usePopupStore } from "@/store/popupStore";

const ConfirmPopup = () => {
  const { setMessage, callback } = usePopupStore();
  return (
    <CommonPopup type="confirm">
      <div className="button__group">
        <CommonButton theme="white" onClick={() => setMessage("")}>
          취소
        </CommonButton>
        <CommonButton theme="success" onClick={() => callback && callback()}>
          확인
        </CommonButton>
      </div>
    </CommonPopup>
  );
};

export default ConfirmPopup;
