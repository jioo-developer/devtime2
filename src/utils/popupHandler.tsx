"use client";
import { usePopupStore } from "@/store/popupStore";
import CommonPopup from "@/components/atoms/CommonPopup/CommonPopup";
import ConfirmPopup from "@/components/modules/Popup/Confirm/ConfirmPopup";

type popupPropsType = {
  message: string;
  type?: string;
  callback?: () => void;
};

export const popuprHandler = ({
  message,
  type = "alert",
  callback,
}: popupPropsType) => {
  if (type === "alert") {
    usePopupStore.setState({
      message,
      type,
    });
  } else if (type === "confirm") {
    usePopupStore.setState({
      message,
      type,
      callback,
    });
  }
};

export const ReturnPopup = () => {
  const { message, type, callback } = usePopupStore();
  if (message !== "") {
    if (type === "alert") {
      return <CommonPopup />;
    } else if (type === "confirm") {
      return (
        <ConfirmPopup message={message} onConfirm={callback || (() => {})} />
      );
    }
  }
};
