import React from "react";
import styles from "./CommonDropdown.module.css";
import {
  DropdownLabel,
  DropdownMenu,
  DropdownTrigger,
  useDropdown,
} from "./useDropdown";

type DropdownOption = {
  value: string;
  label: string;
};

type CommonDropdownProps = {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export default function CommonDropdown({
  label,
  placeholder = "Placeholder",
  options,
  value,
  onChange,
  className,
}: CommonDropdownProps) {
  const { isOpen, toggle, close, rootRef } = useDropdown();

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    close();
  };

  return (
    <div
      className={`${styles.dropdownWrapper} ${className || ""}`}
      ref={rootRef}
    >
      {label && <DropdownLabel label={label} />}

      <DropdownTrigger
        isOpen={isOpen}
        text={displayText}
        isPlaceholder={!selectedOption}
        onClick={toggle}
      />

      {isOpen && (
        <DropdownMenu options={options} value={value} onSelect={handleSelect} />
      )}
    </div>
  );
}
