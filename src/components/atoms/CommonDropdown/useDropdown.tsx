import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import styles from "./CommonDropdown.module.css";

type TriggerProps = {
  isOpen: boolean;
  text: string;
  isPlaceholder: boolean;
  onClick: () => void;
};

type MenuProps = {
  options: { value: string; label: string }[];
  value?: string;
  onSelect: (value: string) => void;
};

export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((v) => !v);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;

      if (!root.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { isOpen, open, close, toggle, rootRef };
}

export function DropdownLabel({ label }: { label: string }) {
  return <label className={styles.label}>{label}</label>;
}

export function DropdownMenu({ options, value, onSelect }: MenuProps) {
  return (
    <ul className={styles.menu}>
      {options.map((option) => (
        <li
          key={option.value}
          className={`${styles.menuItem} ${
            option.value === value ? styles.selected : ""
          }`}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );
}

export function DropdownTrigger({
  isOpen,
  text,
  isPlaceholder,
  onClick,
}: TriggerProps) {
  return (
    <button
      type="button"
      className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
      onClick={onClick}
    >
      <span
        className={isPlaceholder ? styles.placeholderText : styles.selectedText}
      >
        {text}
      </span>

      {isOpen ? (
        <MdKeyboardArrowUp size={20} className={styles.icon} />
      ) : (
        <MdKeyboardArrowDown size={20} className={styles.icon} />
      )}
    </button>
  );
}
