// PageButton.tsx
import clsx from "clsx";
import styles from "../style.module.css";

type PageButtonProps = {
  page: number;
  active: boolean;
  onClick: () => void;
};

export function PageButton({ page, active, onClick }: PageButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.pageButton, active && styles.active)}
      onClick={onClick}
      aria-label={`${page}페이지`}
      aria-current={active ? "page" : undefined}
    >
      {page}
    </button>
  );
}
