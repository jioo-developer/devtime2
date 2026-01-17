import { ReactNode } from "react";
import CommonButton from "../CommonButton/CommonButton";
import { usePopupStore } from "@/store/popupStore";
import styles from "./CommonPopup.module.css";
import clsx from "clsx";

type Props = {
  type?: "alert" | string;
  width?: number | string;
  height?: number | string;
  textAlign?: "left" | "center";
  children?: ReactNode;
};

const CommonPopup = ({
  type = "alert",
  width = 400,
  height = "auto",
  textAlign = "left",
  children,
}: Props) => {
  const { message, setMessage } = usePopupStore();
  const isAlert = type === "alert";

  return (
    <>
      <div
        data-testid="popup-test"
        data-cy="popup-test"
        className={clsx(styles.fullscreen, styles.darkLayer)}
      />

      <div className={clsx(styles.fullscreen, styles.whiteBoxWrapper)}>
        <div
          className={styles.whiteBox}
          style={{
            width: typeof width === "number" ? `${width}px` : width,
            height:
              height === "auto"
                ? "auto"
                : typeof height === "number"
                ? `${height}px`
                : height,
          }}
        >
          <p className={styles.message} style={{ textAlign }}>
            {message}
          </p>

          {isAlert ? (
            <CommonButton theme="primary" onClick={() => setMessage("")}>
              확인
            </CommonButton>
          ) : (
            children
          )}
        </div>
      </div>
    </>
  );
};

export default CommonPopup;
