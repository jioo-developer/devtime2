"use client";

import React from "react";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import styles from "./ConfirmPopup.module.css";

interface ConfirmPopupProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmPopup({
  title = "확인",
  message,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}: ConfirmPopupProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonGroup}>
          <CommonButton theme="secondary" onClick={onCancel} width="48%">
            {cancelText}
          </CommonButton>
          <CommonButton theme="primary" onClick={onConfirm} width="48%">
            {confirmText}
          </CommonButton>
        </div>
      </div>
    </div>
  );
}
