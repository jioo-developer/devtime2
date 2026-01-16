"use client";

import React from "react";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import styles from "./AlertPopup.module.css";

interface AlertPopupProps {
  title?: string;
  message: string;
  onConfirm: () => void;
}

export default function AlertPopup({
  title = "알림",
  message,
  onConfirm,
}: AlertPopupProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonGroup}>
          <CommonButton theme="primary" onClick={onConfirm} width="100%">
            확인
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
