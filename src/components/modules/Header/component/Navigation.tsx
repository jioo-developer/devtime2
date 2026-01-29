"use client";

import React from "react";
import Link from "next/link";
import styles from "../style.module.css";
import { useIsLoggedIn } from "@/app/Home/hooks/useIsLoggedIn";

function Navigation() {
  const { isLoggedIn } = useIsLoggedIn();

  return (
    <nav>
      {isLoggedIn ? (
        <ul className={styles.navigation}>
          <li>
            <Link href="/dashboard">
              대시보드
            </Link>
          </li>
          <li>
            <Link href="/ranking">
              랭킹
            </Link>
          </li>
        </ul>
      ) : null}
    </nav>
  );
}

export default Navigation;
