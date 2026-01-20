import React from "react";
import styles from "./style.module.css";

function Navigation() {
  return (
    <nav>
      <ul className={styles.navigation}>
        <li>대시보드</li>
        <li>랭킹</li>
      </ul>
    </nav>
  );
}

export default Navigation;
