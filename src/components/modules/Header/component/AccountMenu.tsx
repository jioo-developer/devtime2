"use client";
import React from "react";
import styles from "../style.module.css";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import DefaultImage from "@/asset/images/default_profile_image.svg";
import Link from "next/link";
import { useLogout } from "@/app/login/hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/authenticatedApiClient";
import { QueryKey } from "@/constant/queryKeys";
import { useIsLoggedIn } from "@/app/Home/hooks/useIsLoggedIn";

type ProfileResponse = {
  nickname?: string;
  profileImageUrl?: string;
};

function AccountMenu() {
  const { mutate: logout } = useLogout();
  const { isLoggedIn } = useIsLoggedIn();

  const { data: profile } = useQuery({
    queryKey: [QueryKey.PROFILE],
    queryFn: () => AuthenticatedApiClient.get<ProfileResponse>("/api/profile"),
    retry: false,
    enabled: isLoggedIn,
  });
  const nickname = profile?.nickname;
  const profileImageUrl = profile?.profileImageUrl;

  return (
    <ul className={styles.navigation}>
      {isLoggedIn ? (
        <>
          <li className={styles.profileCard}>
            <CommonImage
              src={profileImageUrl ?? DefaultImage}
              alt="기본 프로필 이미지"
              width={40}
              height={40}
            />
            <p className={styles.profileName}>{nickname || "DevTime"}</p>
          </li>
          <li>
            <button
              onClick={() => logout()}
              className={styles.logoutButton}
            >
              로그아웃
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href="/login">
              로그인
            </Link>
          </li>
          <li>
            <Link href="/auth">
              회원가입
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}

export default AccountMenu;
