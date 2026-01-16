import { useRef } from "react";
import styles from "./CommonTextArea.module.css";
import clsx from "clsx";

type AutoResizeTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  };

export function AutoResizeTextarea({
  onInput,
  label,
  error,
  className,
  ...props
}: AutoResizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;

    onInput?.(e);
  };

  return (
    <label className={styles.labelArea}>
      {label && <span>{label}</span>}

      <textarea
        {...props}
        ref={ref}
        rows={1}
        onInput={handleInput}
        className={clsx(styles.textarea, className)}
        style={{
          resize: "none",
          overflow: "hidden",
          ...props.style,
        }}
      />

      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}
