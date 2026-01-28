"use client";
import React from "react";
import HeaderLogo from "@/asset/images/header_logo.svg";
import styles from "./style.module.css";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import Navigation from "./component/Navigation";
import AccountMenu from "./component/AccountMenu";
import Link from "next/link";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerIn}>
        <div className={styles.leftCon}>
          <Link href="/" prefetch>
            <CommonImage src={HeaderLogo} alt="로고" width={148} height={40} priority />
          </Link>
          <Navigation />
        </div>
        <div className={styles.rightCon}>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
