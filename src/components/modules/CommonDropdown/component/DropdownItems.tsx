import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import styles from "../style.module.css";

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return <label className={styles.label}>{children}</label>;
}

export function DropdownTrigger({
  isOpen,
  onClick,
  children,
}: {
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
      onClick={onClick}
    >
      {children}
      {isOpen ? (
        <MdKeyboardArrowUp size={20} className={styles.icon} />
      ) : (
        <MdKeyboardArrowDown size={20} className={styles.icon} />
      )}
    </button>
  );
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <ul className={styles.menu}>{children}</ul>;
}

export function DropdownItem({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li
      className={`${styles.menuItem} ${selected ? styles.selected : ""}`}
      onClick={onClick}
    >
      {children}
    </li>
  );
}
