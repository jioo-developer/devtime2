import React from "react";
import { cookies } from "next/headers";
import HeaderLogo from "@/asset/images/header_logo.svg";
import styles from "./style.module.css";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import Navigation from "./component/Navigation";
import AccountMenu from "./component/AccountMenu";
import Link from "next/link";

function Header() {
  const token = cookies().get("authToken")?.value;

  return (
    <header className={styles.header}>
      <div className={styles.headerIn}>
        <div className={styles.leftCon}>
          <Link href="/" prefetch>
            <CommonImage src={HeaderLogo} alt="로고" width={148} height={40} />
          </Link>
          <Navigation />
        </div>
        <div className={styles.rightCon}>
          <AccountMenu isLoggedIn={!!token} />
        </div>
      </div>
    </header>
  );
}

export default Header;
