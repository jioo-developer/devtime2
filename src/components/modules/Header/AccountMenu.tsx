import React from "react";
import styles from "./style.module.css";
import CommonImage from "@/components/atoms/CommonImage";
import DefaultImage from "@/asset/images/default_profile_image.svg";
interface AccountMenuProps {
  isLoggedIn: boolean;
}

function AccountMenu({ isLoggedIn }: AccountMenuProps) {
  return (
    <ul className={styles.navigation}>
      {isLoggedIn ? (
        <div className={styles.profileCard}>
          <CommonImage
            src={DefaultImage}
            alt="기본 프로필 이미지"
            width={40}
            height={40}
          />
          <p className={styles.profileName}>DevTime</p>
        </div>
      ) : (
        <>
          <li>로그인</li>
          <li>회원가입</li>
        </>
      )}
    </ul>
  );
}

export default AccountMenu;
