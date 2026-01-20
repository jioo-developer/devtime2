// NavButton.tsx
import clsx from "clsx";
import styles from "../style.module.css";

type NavButtonProps = {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export function NavButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: NavButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.navButton, disabled && styles.disabled)}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
