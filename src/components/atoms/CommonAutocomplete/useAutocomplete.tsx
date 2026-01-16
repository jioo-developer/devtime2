import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import styles from "./CommonAutocomplete.module.css";

/* =========================
 * Types / Constants (TOP)
 * ========================= */

export type AutocompleteOption = {
  value: string;
  label: string;
};

export type UseAutocompleteParams = {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
};

export type UseAutocompleteResult = {
  isOpen: boolean;
  inputValue: string;
  setInputValue: (v: string) => void;
  open: () => void;
  close: () => void;
  rootRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  filteredOptions: AutocompleteOption[];
  selectOption: (option: AutocompleteOption) => void;
  changeInput: (next: string) => void;
};

export type HighlightMatchProps = {
  text: string;
  query: string;
};

export type AutocompleteLabelProps = {
  label: string;
};

export type AutocompleteInputProps = {
  placeholder: string;
  value: string;
  isOpen: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (next: string) => void;
  onFocus: () => void;
};

export type AutocompleteMenuProps = {
  isVisible: boolean;
  inputValue: string;
  filteredOptions: AutocompleteOption[];
  showAddButton: boolean;
  onSelect: (option: AutocompleteOption) => void;
  onAddNew: () => void;
};

/* =========================
 * Hook: state + outside click + filtering + selection
 * ========================= */

export function useAutocomplete({
  options,
  value,
  onChange,
}: UseAutocompleteParams): UseAutocompleteResult {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

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

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const filteredOptions = useMemo(() => {
    const q = inputValue.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, inputValue]);

  const changeInput = (next: string) => {
    setInputValue(next);
    open();
    // 기존 동작 유지: 입력값 변경마다 부모에 통지
    onChange?.(next);
  };

  const selectOption = (option: AutocompleteOption) => {
    // 입력창에 label을 보여주고 부모에도 label을 통지
    setInputValue(option.label);
    onChange?.(option.label);
    close();
  };

  return {
    isOpen,
    inputValue,
    setInputValue,
    open,
    close,
    rootRef,
    inputRef,
    filteredOptions,
    selectOption,
    changeInput,
  };
}

/* =========================
 * Util: highlight
 * ========================= */

export function HighlightMatch({ text, query }: HighlightMatchProps) {
  if (!query) return <>{text}</>;

  // 정규식 특수문자 이스케이프
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <strong key={index} className={styles.highlight}>
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

/* =========================
 * Parts
 * ========================= */

export function AutocompleteLabel({ label }: AutocompleteLabelProps) {
  return <label className={styles.label}>{label}</label>;
}

export function AutocompleteInput({
  placeholder,
  value,
  isOpen,
  inputRef,
  onChange,
  onFocus,
}: AutocompleteInputProps) {
  return (
    <input
      ref={inputRef}
      type="text"
      className={`${styles.input} ${isOpen ? styles.open : ""}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
    />
  );
}

export function AutocompleteMenu({
  isVisible,
  inputValue,
  filteredOptions,
  showAddButton,
  onSelect,
  onAddNew,
}: AutocompleteMenuProps) {
  if (!isVisible) return null;

  return (
    <div className={styles.menu}>
      {filteredOptions.length > 0 && (
        <ul className={styles.list}>
          {filteredOptions.map((option, index) => (
            <li
              key={`${option.value}-${index}`}
              className={styles.menuItem}
              onClick={() => onSelect(option)}
            >
              <HighlightMatch text={option.label} query={inputValue} />
            </li>
          ))}
        </ul>
      )}

      {showAddButton && inputValue && (
        <button type="button" className={styles.addButton} onClick={onAddNew}>
          <MdAdd size={18} />
          <span>Add New Item</span>
        </button>
      )}
    </div>
  );
}
