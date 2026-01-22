"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import LoginBgImage from "@/asset/images/login-background-image.png";
import LogoBlue from "@/asset/images/logo_blue.svg";
import { useLogin } from "./hooks/useLogin";
import "./style.css";
import Link from "next/link";
import { safeInternalPath } from "@/utils/pathUtils";
import { isAccessTokenValid } from "@/utils/cookieUtils";

type LoginFormData = {
  email: string;
  password: string;
};

function Client() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthCheck, setisAuthCheck] = useState(true);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<LoginFormData>({
    mode: "onChange",
  });

  const { email, password } = watch();
  const { mutate: login } = useLogin();

  const isFormValid =
    !!email && !!password && !errors.email && !errors.password;

  const onSubmit = async (data: LoginFormData) => {
    if(isFormValid) {
      login(data);
    } else {
      await trigger(["email", "password"]);
    }
  };

  // 로그인된 상태면 로그인 페이지 접근 불가 (렌더링 전에 체크)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // 쿠키에서 만료 시간 확인
    if (isAccessTokenValid()) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const redirectParam = safeInternalPath(searchParams.get("redirect"));
        router.replace(redirectParam ?? "/");
        return;
      }
    }
    setisAuthCheck(false);
  }, [router, searchParams]);

  if (isAuthCheck) {
    return null;
  }

  return (
    <main className="loginLayout">
      <CommonImage
        src={LoginBgImage}
        alt="로그인 백그라운드 이미지"
        className="backgroundImage"
        width={800}
      />
      <div className="loginWrap">
        <div className="loginContent">
          <CommonImage src={LogoBlue} alt="DevTime 로고" className="logo" />

          <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
            <CommonInput
              id="email"
              testId="email-input"
              label="아이디"
              type="text"
              placeholder="이메일 주소를 입력해 주세요."
              register={register}
              validation={{
                required: "이메일을 입력하세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "이메일 형식으로 작성해 주세요.",
                },
              }}
              error={errors.email}
            />

            <CommonInput
              id="password"
              testId="password-input"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              register={register}
              validation={{
                required: "비밀번호를 입력하세요.",
                minLength: {
                  value: 8,
                  message: "비밀번호는 8자 이상이어야 합니다.",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                  message: "비밀번호는 영문과 숫자 조합이어야 합니다.",
                },
              }}
              error={errors.password}
            />

            <CommonButton
              theme={isFormValid ? "primary" : "disable"}
              type="submit"
              width="100%"
              style={{ marginTop: 48 }}
              disabled={!isFormValid}
            >
              로그인
            </CommonButton>
          </form>

          <Link href="/auth" prefetch>
            <CommonButton theme="none" className="goSignup">
              <span>회원가입</span>
            </CommonButton>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Client;
