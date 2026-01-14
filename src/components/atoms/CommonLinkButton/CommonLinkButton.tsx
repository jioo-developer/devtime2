import { ReactNode } from "react";
import styles from "./CommonLinkButton.module.css";
import clsx from "clsx";

export interface CommonLinkButtonProps {
  children: ReactNode;
  size?: "sm" | "rg" | "md" | "lg";
  theme?: "white" | "success" | "primary" | "disable" | "warnning" | "none";
  padding?: "none" | "";
  testId?: string;
  onClick?: () => void;
  className?: string;
}

function CommonLinkButton({
  children,
  onClick,
  size = "rg",
  theme = "none",
  testId,
  padding = "",
  className,
}: CommonLinkButtonProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      data-testid={testId}
      data-cy={testId}
      onClick={onClick}
      className={clsx(
        styles.base,
        styles[size],
        styles[theme],
        padding === "none" && styles.noPadding,
        className
      )}
    >
      {children}
    </div>
  );
}

export default CommonLinkButton;
