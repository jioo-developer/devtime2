"use client";
import { ReactNode } from "react";
import styles from "./style.module.css";
import clsx from "clsx";

export interface CommonChipProps {
  children: ReactNode;
  onDelete?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "outlined" | "filled";
  testId?: string;
}

function CommonChip({
  children,
  onDelete,
  size = "md",
  variant = "outlined",
  testId,
}: CommonChipProps) {
  return (
    <div
      className={clsx(styles.chip, styles[size], styles[variant])}
      data-testid={testId}
    >
      <span className={styles.label}>{children}</span>
      {onDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={onDelete}
          aria-label="삭제"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default CommonChip;
