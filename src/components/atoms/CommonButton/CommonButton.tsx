import styles from "./CommonButton.module.css";
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CommonButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "rg" | "md" | "lg";
  theme: "white" | "success" | "primary" | "disable" | "warnning" | "none";
  padding?: "none";
  testId?: string;
}

function CommonButton({
  children,
  onClick,
  disabled = false,
  size = "rg",
  theme,
  type = "button",
  padding,
  testId,
}: CommonButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={clsx(
        styles.baseButton,
        styles[size],
        styles[theme],
        padding === "none" && styles.noPadding
      )}
    >
      {children}
    </button>
  );
}

export default CommonButton;
