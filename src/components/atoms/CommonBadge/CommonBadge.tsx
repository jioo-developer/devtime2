import React from "react";
import styles from "./CommonBadge.module.css";

interface CommonBadgeProps {
  text: string;
  variant?: "primary" | "secondary" | "gray";
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function CommonBadge({
  text,
  variant = "primary",
  size = "medium",
  className,
}: CommonBadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${styles[size]} ${
        className || ""
      }`}
    >
      {text}
    </span>
  );
}
