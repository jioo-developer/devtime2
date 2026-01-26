import {
  FormEvent,
  TextareaHTMLAttributes,
  useRef,
  forwardRef,
  MutableRefObject,
} from "react";
import clsx from "clsx";
import styles from "./style.module.css";

type AutoResizeTextAreaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  };


export const CommonTextArea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextAreaProps
>(function CommonTextArea(props, forwardedRef) {
  const {
    label,
    error,
    className,
    onInput,
    style,
    ...restProps
  } = props;

  const internalRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (event: FormEvent<HTMLTextAreaElement>) => {
    const element = (
      forwardedRef ?? internalRef
    ) as MutableRefObject<HTMLTextAreaElement>;

    const textarea = element.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    onInput?.(event);
  };

  return (
    <label className={styles.labelArea}>
      {label && <span>{label}</span>}

      <textarea
        {...restProps}
        ref={forwardedRef ?? internalRef}
        rows={1}
        onInput={handleInput}
        className={clsx(styles.textarea, className)}
        style={{
          resize: "none",
          overflow: "hidden",
          ...style,
        }}
      />

      {error && <span className="error">{error}</span>}
    </label>
  );
});
