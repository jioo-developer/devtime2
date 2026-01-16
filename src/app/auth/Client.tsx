"use client";
import React, { useMemo, useState } from "react";
import Logo from "@/asset/images/✅ Logo.svg";
import Background from "@/asset/images/logo_background.jpg";
import CommonImage from "@/components/atoms/CommonImage";
import styles from "./style.module.css";
import { useForm } from "react-hook-form";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import { loginInputTypes } from "@/types/commonType";
import InputFields from "./component/InputFileds";
import AgreementList from "./component/AgreementList";
import { handleSignupSubmit } from "./hooks/useSignupSubmit";

interface LoginProps {
  onSubmit?: (data: authInputType) => Promise<void>;
}

export interface authInputType extends loginInputTypes {
  nickNameRequired: string;
  passwordConfirm: string;
}

function Client({ onSubmit }: LoginProps) {
  const {
    register,
    watch,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<authInputType>({
    mode: "onChange",
  });

  const [emailSuccess, setEmailSuccess] = useState<string>("");
  const [nicknameSuccess, setNicknameSuccess] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 전체 validation 체크
  const idRequired = watch("idRequired");
  const nickNameRequired = watch("nickNameRequired");
  const passwordRequired = watch("passwordRequired");
  const passwordConfirm = watch("passwordConfirm");

  const isFormValid = useMemo((): boolean => {
    return (
      !!idRequired &&
      !!emailSuccess &&
      !!nickNameRequired &&
      !!nicknameSuccess &&
      !!passwordRequired &&
      !!passwordConfirm &&
      !errors.passwordRequired &&
      !errors.passwordConfirm &&
      agreed
    );
  }, [
    idRequired,
    emailSuccess,
    nickNameRequired,
    nicknameSuccess,
    passwordRequired,
    passwordConfirm,
    errors.passwordRequired,
    errors.passwordConfirm,
    agreed,
  ]);

  const handleFormSubmit = async (data: authInputType) => {
    await handleSignupSubmit({
      data,
      isFormValid,
      isSubmitting,
      setIsSubmitting,
      onSubmit,
    });
  };

  return (
    <main className={styles.authLayout}>
      <section className={`${styles.section} ${styles.logoSection}`}>
        <CommonImage
          src={Background}
          alt="서비스 로고 백그라운드"
          fill
          className={styles.background}
        />
        <div className={styles.content}>
          <CommonImage
            src={Logo}
            alt="서비스 로고"
            width={264}
            height={200}
            className={styles.logo}
          />
          <p className={styles.contentText}>개발자를 위한 타이머</p>
        </div>
      </section>

      <section className={`${styles.section} ${styles.formSection}`}>
        <h2 className={styles.formTitle}>회원가입</h2>
        <form
          className={styles.authForm}
          data-testid="auth-form-test"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <InputFields
            register={register}
            errors={errors}
            watch={watch}
            setError={setError}
            clearErrors={clearErrors}
            emailSuccess={emailSuccess}
            setEmailSuccess={setEmailSuccess}
            nicknameSuccess={nicknameSuccess}
            setNicknameSuccess={setNicknameSuccess}
          />
          <AgreementList agreed={agreed} setAgreed={setAgreed} />
          <CommonButton
            theme={isFormValid ? "primary" : "disable"}
            size="rg"
            type="submit"
            width={"100%"}
            disabled={!isFormValid}
          >
            회원가입
          </CommonButton>
        </form>
        <div className={styles.goLogin}>
          <p>
            회원이신가요? <span>로그인 바로가기</span>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Client;
