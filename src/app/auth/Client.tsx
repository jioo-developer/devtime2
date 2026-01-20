"use client";
import React, { useState } from "react";
import "./style.css";
import CommonImage from "@/components/atoms/CommonImage/CommonImage";
import Logo from "@/asset/images/Logo.svg";
import Background from "@/asset/images/logo_background.jpg";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import AgreementList from "./component/AgreementList";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import { useForm } from "react-hook-form";
import { useCheckEmail } from "./hooks/useCheckEmail";
import { useCheckNickname } from "./hooks/useCheckNickname";
import { useSignup } from "./hooks/useSignup";

export type AuthFormData = {
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
};

interface AuthPageProps {
  onSubmit?: (data: AuthFormData) => Promise<void>;
}

function AuthPage({ onSubmit }: AuthPageProps = {}) {
  const {
    register,
    watch,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    mode: "onChange",
  });
  const [emailSuccess, setEmailSuccess] = useState<string>("");
  const [nicknameSuccess, setNicknameSuccess] = useState<string>("");
  const [agreed, setAgreed] = useState(false);

  const { mutate: checkEmail } = useCheckEmail({
    setError,
    clearErrors,
    setSuccessMessage: setEmailSuccess,
  });

  const { mutate: checkNickname } = useCheckNickname({
    setError,
    clearErrors,
    setSuccessMessage: setNicknameSuccess,
  });

  const { mutate } = useSignup();

  const { email, nickname, password, passwordConfirmation } = watch();

  const isFormValid =
    !!email &&
    !!emailSuccess &&
    !!nickname &&
    !!nicknameSuccess &&
    !!password &&
    !!passwordConfirmation &&
    !errors.password &&
    !errors.passwordConfirmation &&
    agreed;

  const handleFormSubmit = async (data: AuthFormData) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      mutate(data);
    }
  };

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
        <form
          className="authForm"
          data-testid="auth-form-test"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="filedWrap">
            <CommonInput
              id="email"
              testId="email-input"
              label="아이디"
              type="text"
              placeholder="아이디를 입력하세요"
              register={register}
              validation={{
                required: "이메일을 입력하세요.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "이메일 형식으로 작성해 주세요.",
                },
              }}
              error={errors.email}
              success={emailSuccess}
            />
            <CommonButton
              type="button"
              theme="overlap"
              width={104.6}
              height={44}
              onClick={() => {
                const emailValue = watch("email");
                if (emailValue) {
                  setEmailSuccess("");
                  checkEmail(emailValue);
                }
              }}
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
              validation={{
                required: "닉네임을 입력하세요.",
              }}
              error={errors.nickname}
              success={nicknameSuccess}
            />
            <CommonButton
              type="button"
              theme="overlap"
              width={104.6}
              height={44}
              onClick={() => {
                const nicknameValue = watch("nickname");
                if (nicknameValue) {
                  setNicknameSuccess("");
                  checkNickname(nicknameValue);
                }
              }}
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
            theme={isFormValid ? "primary" : "disable"}
            type="submit"
            width={"100%"}
            disabled={!isFormValid}
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
