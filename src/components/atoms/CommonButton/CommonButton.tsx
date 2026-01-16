import styles from "./ommonButton.module.css";
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CommonButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "rg" | "md" | "lg";
  theme: "primary" | "secondary" | "tertiary" | "disable" | "none" | "overlap";
  isPadding?: boolean;
  testId?: string;
  width?: number | string;
  height?: number | string;
}

function CommonButton({
  children,
  onClick,
  disabled = false,
  size = "rg",
  theme,
  type = "button",
  isPadding = true,
  testId,
  width = 88,
  height = 44,
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
        !isPadding && styles.paddingNone
      )}
      style={{
        width,
        height,
      }}
    >
      {children}
    </button>
  );
}

export default CommonButton;
