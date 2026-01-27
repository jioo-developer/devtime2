import React from "react";
import styles from "../style.module.css";
import Link from "next/link";

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
