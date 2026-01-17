import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
  UseFormSetError,
  UseFormClearErrors,
} from "react-hook-form";
import { authInputType } from "../Client";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import styles from "../style.module.css";
import { handleCheckEmail } from "../hooks/email/useCheckEmail";
import { handleCheckNickname } from "../hooks/nickname/useCheckNickname";

interface AuthInputsProps {
  register: UseFormRegister<authInputType>;
  errors: FieldErrors<authInputType>;
  watch: UseFormWatch<authInputType>;
  setError: UseFormSetError<authInputType>;
  clearErrors: UseFormClearErrors<authInputType>;
  emailSuccess: string;
  setEmailSuccess: (message: string) => void;
  nicknameSuccess: string;
  setNicknameSuccess: (message: string) => void;
}

export default function InputFields({
  register,
  errors,
  watch,
  setError,
  clearErrors,
  emailSuccess,
  setEmailSuccess,
  nicknameSuccess,
  setNicknameSuccess,
}: AuthInputsProps) {
  return (
    <>
      <div className={styles.filedWrap}>
        <CommonInput
          id="idRequired"
          testId="emailRequired"
          label="아이디"
          type="text"
          placeholder="아이디를 입력하세요"
          register={register}
          error={errors.idRequired}
          success={emailSuccess}
        />
        <CommonButton
          size="sm"
          type="button"
          theme="overlap"
          width={104.6}
          height={44}
          onClick={() =>
            handleCheckEmail({
              email: watch("idRequired"),
              setError,
              clearErrors,
              setSuccessMessage: setEmailSuccess,
            })
          }
        >
          중복 확인
        </CommonButton>
      </div>
      <div className={styles.filedWrap}>
        <CommonInput
          id="nickNameRequired"
          testId="nickNameRequired"
          label="닉네임"
          placeholder="닉네임을 입력해주세요"
          register={register}
          error={errors.nickNameRequired}
          success={nicknameSuccess}
        />
        <CommonButton
          size="sm"
          type="button"
          theme="overlap"
          width={104.6}
          height={44}
          onClick={() =>
            handleCheckNickname({
              nickname: watch("nickNameRequired"),
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
        id="passwordRequired"
        testId="passwordRequired"
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
        error={errors.passwordRequired}
      />
      <CommonInput
        id="passwordConfirm"
        testId="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력해 주세요."
        register={register}
        validation={{
          required: "비밀번호를 다시 입력해 주세요.",
          validate: (value: string) =>
            value === watch("passwordRequired") ||
            "비밀번호가 일치하지 않습니다.",
        }}
        error={errors.passwordConfirm}
      />
    </>
  );
}
