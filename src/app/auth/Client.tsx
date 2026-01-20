"use client";
import React, { useState } from "react";
import "./style.css";
import CommonImage from "@/components/atoms/CommonImage";
import Logo from "@/asset/images/Logo.svg";
import Background from "@/asset/images/logo_background.jpg";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import AgreementList from "./component/AgreementList";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import { useForm } from "react-hook-form";
import {
  handleCheckEmail,
  handleCheckNickname,
} from "./handler/handleValidation";

export type AuthFormData = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
};

function AuthPage() {
  const {
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AuthFormData>({
    mode: "onChange",
  });
  const [emailSuccess, setEmailSuccess] = useState<string>("");
  const [nicknameSuccess, setNicknameSuccess] = useState<string>("");
  const [agreed, setAgreed] = useState(false);

  return (
    <main className="authLayout">
      <section className="section logoSection">
        <CommonImage
          src={Background}
          alt="서비스 로고 백그라운드"
          fill
          className="background"
        />
        <div className="content">
          <CommonImage
            src={Logo}
            alt="서비스 로고"
            width={264}
            height={200}
            className="logo"
          />
          <p className="contentText">개발자를 위한 타이머</p>
        </div>
      </section>

      <section className="section formSection">
        <h2 className="formTitle">회원가입</h2>
        <form className="authForm" data-testid="auth-form-test">
          <div className="filedWrap">
            <CommonInput
              id="email"
              testId="email-input"
              label="아이디"
              type="text"
              placeholder="아이디를 입력하세요"
              register={register}
              error={errors.email}
              success={emailSuccess}
            />
            <CommonButton
              type="button"
              theme="overlap"
              width={104.6}
              height={44}
              onClick={() =>
                handleCheckEmail({
                  email: watch("email"),
                  setError,
                  clearErrors,
                  setSuccessMessage: setEmailSuccess,
                })
              }
            >
              중복 확인
            </CommonButton>
          </div>
          <div className="filedWrap">
            <CommonInput
              id="nickname"
              testId="nickname-input"
              label="닉네임"
              placeholder="닉네임을 입력해주세요"
              register={register}
              error={errors.nickname}
              success={nicknameSuccess}
            />
            <CommonButton
              type="button"
              theme="overlap"
              width={104.6}
              height={44}
              onClick={() =>
                handleCheckNickname({
                  nickname: watch("nickname"),
                  setError,
                  clearErrors,
                  setSuccessMessage: setNicknameSuccess,
                })
              }
            >
              중복 확인
            </CommonButton>
          </div>
          <CommonInput
            id="password"
            testId="password-input"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 8자리 이상 입력하세요"
            register={register}
            validation={{
              required: "비밀번호를 입력하세요.",
              minLength: {
                value: 8,
                message: "비밀번호는 8자리 이상이어야 합니다.",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                message: "비밀번호는 영문과 숫자를 포함해야 합니다.",
              },
            }}
            error={errors.password}
          />
          <CommonInput
            id="passwordConfirmation"
            testId="password-confirmation-input"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요."
            register={register}
            validation={{
              required: "비밀번호를 다시 입력해 주세요.",
              validate: (value: string) =>
                value === watch("password") || "비밀번호가 일치하지 않습니다.",
            }}
            error={errors.passwordConfirmation}
          />
          <AgreementList agreed={agreed} setAgreed={setAgreed} />
          <CommonButton
            theme={agreed ? "primary" : "disable"}
            type="submit"
            width={"100%"}
            disabled={!agreed}
          >
            회원가입
          </CommonButton>
        </form>
        <div className="goLogin">
          <p>
            회원이신가요? <span>로그인 바로가기</span>
          </p>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
