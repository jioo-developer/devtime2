import React from "react";
import Link from "next/link";
import styles from "../style.module.css";

function Navigation() {
  return (
    <nav>
      <ul className={styles.navigation}>
        <li>
          <Link href="/dashboard" prefetch>
            대시보드
          </Link>
        </li>
        <li>
          <Link href="/ranking" prefetch>
            랭킹
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
