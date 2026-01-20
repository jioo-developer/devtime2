"use client";
import styles from "./style.module.css";
import { useDropdown } from "./hooks/useDropdown";
import {
  DropdownLabel,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "./component/DropdownItems";

type Option = { value: string; label: string };

type CommonDropdownProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export default function CommonDropdown({
  label,
  placeholder = "선택하세요",
  options,
  value,
  onChange,
  className,
}: CommonDropdownProps) {
  const { isOpen, toggle, select, rootRef } = useDropdown(onChange);

  const selected = options.find((o) => o.value === value);

  return (
    <div
      ref={rootRef}
      className={`${styles.dropdownWrapper} ${className ?? ""}`}
    >
      {label && <DropdownLabel>{label}</DropdownLabel>}

      <DropdownTrigger isOpen={isOpen} onClick={toggle}>
        <span
          className={selected ? styles.selectedText : styles.placeholderText}
        >
          {selected?.label ?? placeholder}
        </span>
      </DropdownTrigger>

      {isOpen && (
        <DropdownMenu>
          {options.map((o) => (
            <DropdownItem
              key={o.value}
              selected={o.value === value}
              onClick={() => select(o.value)}
            >
              {o.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </div>
  );
}
