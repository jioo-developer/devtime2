import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import styles from "./CommonInput.module.css";
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
        data-cy={testId}
        className={clsx(styles.input)}
        {...(register && register(id, validation))}
      />

      {error && <span className={styles.error}>{error.message}</span>}
      {!error && success && <span className={styles.success}>{success}</span>}
    </label>
  );
}

CommonInput.displayName = "CommonInput";

export default CommonInput;
