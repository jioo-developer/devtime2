import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { CSSProperties } from "react";
import styles from "./style.module.css";
import clsx from "clsx";

export interface CommonInputProps<T extends FieldValues> {
  id: Path<T>;
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
  register?: UseFormRegister<T>;
  error?: FieldError;
  validation?: RegisterOptions<T>;
  value?: string | number;
  label?: string;
  testId?: string;
  success?: string;
  style?: CSSProperties;
}

function CommonInput<T extends FieldValues>({
  id,
  type = "text",
  placeholder = "",
  register,
  error,
  validation = {},
  value,
  label,
  testId,
  success,
  style,
}: CommonInputProps<T>) {
  return (
    <label htmlFor={String(id)} className={styles.labelArea}>
      {label && <span>{label}</span>}

      <input
        id={String(id)}
        type={type}
        value={value}
        placeholder={placeholder}
        data-testid={testId}
        className={clsx(styles.input)}
        style={style}
        {...(register && register(id, validation))}
      />

      {error && <span className="error">{error.message}</span>}
      {!error && success && <span className="success">{success}</span>}
    </label>
  );
}

export default CommonInput;
