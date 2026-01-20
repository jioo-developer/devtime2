import { FormEvent, TextareaHTMLAttributes, useRef } from "react";
import styles from "./style.module.css";
import clsx from "clsx";

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function CommonTextArea({
  onInput,
  label,
  error,
  className,
  ...props
}: AutoResizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: FormEvent<HTMLTextAreaElement>) => {
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

      {error && <span className="error">{error}</span>}
    </label>
  );
}
