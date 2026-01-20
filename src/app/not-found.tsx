"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "../asset/404.module.css";
import CommonButton from "@/atoms/CommonButton/CommonButton";
const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className={styles.notfoundRoot}>
      <div className={styles.notfoundWrapper}>
        <div className={styles.notfoundBg}></div>
        <h1 className={styles.title}>페이지를 찾을 수 없습니다.</h1>
        <CommonButton theme="primary" onClick={() => router.back()}>
          돌아가기
        </CommonButton>
      </div>
    </div>
  );
};

export default ErrorPage;
