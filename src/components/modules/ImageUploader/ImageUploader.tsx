"use client";

import React, { useState, useRef } from "react";
import styles from "./style.module.css";
import CommonImage from "@/components/atoms/CommonImage";

interface ImageUploaderProps {
  label?: string;
  maxSize?: number; // MB
  acceptedFormats?: string[];
  onImageChange?: (file: File | null) => void;
}

function ImageUploader({
  label = "Label",
  maxSize = 5,
  acceptedFormats = [".png", ".jpg", ".jpeg"],
  onImageChange,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // 파일 크기 체크
      if (file.size > maxSize * 1024 * 1024) {
        alert(`파일 크기는 ${maxSize}MB 이하여야 합니다.`);
        return;
      }

      // 파일 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onImageChange?.(file);
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.imageUploadField}>
      <label className={styles.fieldLabel}>{label}</label>

      <div className={styles.fieldRow}>
        <div className={styles.uploadBox} onClick={handleBoxClick}>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleFileChange}
            className={styles.fileInput}
          />

          {!preview ? (
            <span className={styles.uploadPlus}>+</span>
          ) : (
            <CommonImage
              className={styles.uploadPreview}
              src={preview}
              alt="Preview"
            />
          )}
        </div>

        <p className={styles.helperText}>
          {maxSize}MB 미만의 {acceptedFormats.join(", ")} 파일
        </p>
      </div>
    </div>
  );
}

export default ImageUploader;
