import styles from "./style.module.css";
import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  theme: "primary" | "secondary" | "tertiary" | "disable" | "none" | "overlap";
  fontSize?:
    | "heading"
    | "title"
    | "subtitle"
    | "body"
    | "bodySmall"
    | "caption"
    | "label";
  testId?: string;
  width?: number | string;
  height?: number | string;
}

function CommonButton({
  children,
  theme,
  fontSize = "bodySmall",
  type = "button",
  testId,
  width,
  height,
  ...rest
}: CommonButtonProps) {
  return (
    <button
      type={type}
      data-testid={testId}
      className={clsx(
        styles.baseButton,
        styles[theme],
        fontSize && styles[fontSize],
      )}
      style={{ width, height }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default CommonButton;
