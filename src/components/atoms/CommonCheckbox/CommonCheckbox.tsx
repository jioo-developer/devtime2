import styles from "./style.module.css";
import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export interface CommonCheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: number;
  color?: "blue" | "red" | "white" | "grey";
  testId?: string;
}

const CommonCheckbox = forwardRef<HTMLInputElement, CommonCheckboxProps>(
  ({ size = 22, color = "blue", testId, className, ...rest }, ref) => {
    return (
      <label
        className={clsx(styles.checkboxWrapper, styles[color], className)}
        style={{ width: size, height: size }}
      >
        <input
          ref={ref}
          type="checkbox"
          data-testid={testId}
          className={styles.checkbox}
          {...rest}
        />
        <span className={styles.checkmark}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3346 4L6.0013 11.3333L2.66797 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>
    );
  },
);

CommonCheckbox.displayName = "CommonCheckbox";

export default CommonCheckbox;
