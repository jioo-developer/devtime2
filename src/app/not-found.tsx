"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "../asset/404.module.css";

const ErrorPage = () => {
  const router = useRouter();

  return (
    <div className={styles.notfoundRoot}>
      <div className={styles.notfoundWrapper}>
        <h1 className={styles.title}>페이지를 찾을 수 없습니다.</h1>
        <button onClick={() => router.push("/auth")}>돌아가기</button>
      </div>
    </div>
  );
};

export default ErrorPage;
