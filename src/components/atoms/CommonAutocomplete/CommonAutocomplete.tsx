import React, { useState } from "react";
import styles from "./CommonAutocomplete.module.css";
import CommonChip from "../CommonChip/CommonChip";
import {
  AutocompleteInput,
  AutocompleteLabel,
  AutocompleteMenu,
  type AutocompleteOption,
  useAutocomplete,
} from "./useAutocomplete";

/* =========================
 * Types (TOP)
 * ========================= */

export type CommonAutocompleteProps = {
  label?: string;
  placeholder?: string;
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  onAddNew?: (inputValue: string) => void;
  className?: string;
  showAddButton?: boolean;
  multiSelect?: boolean;
  selectedItems?: string[];
  onSelectedItemsChange?: (items: string[]) => void;
};

/* =========================
 * Component
 * ========================= */

export default function CommonAutocomplete({
  label,
  placeholder = "Placeholder",
  options,
  value,
  onChange,
  onAddNew,
  className,
  showAddButton = false,
  multiSelect = false,
  selectedItems: externalSelectedItems,
  onSelectedItemsChange,
}: CommonAutocompleteProps) {
  const [internalSelectedItems, setInternalSelectedItems] = useState<string[]>(
    []
  );

  const selectedItems = externalSelectedItems ?? internalSelectedItems;
  const setSelectedItems = onSelectedItemsChange ?? setInternalSelectedItems;

  const {
    isOpen,
    inputValue,
    rootRef,
    inputRef,
    filteredOptions,
    open,
    close,
    changeInput,
    selectOption,
    setInputValue,
  } = useAutocomplete({ options, value, onChange });

  const showMenu =
    isOpen &&
    (inputValue.length > 0 || filteredOptions.length > 0 || showAddButton);

  const handleAddNew = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (multiSelect) {
      if (!selectedItems.includes(trimmed)) {
        setSelectedItems([...selectedItems, trimmed]);
      }
      setInputValue("");
    } else {
      onAddNew?.(trimmed);
    }
    close();
  };

  const handleSelect = (option: AutocompleteOption) => {
    // 멀티 선택 모드에서는 입력란에 텍스트만 채우고 뱃지 추가는 안 함
    if (multiSelect) {
      setInputValue(option.label);
      // 드롭다운은 닫지 않고 Add 버튼이 보이도록 유지
    } else {
      selectOption(option);
    }
  };

  const handleRemoveItem = (item: string) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  return (
    <div
      className={`${styles.autocompleteWrapper} ${className || ""}`}
      ref={rootRef}
    >
      {label && <AutocompleteLabel label={label} />}

      <AutocompleteInput
        inputRef={inputRef}
        placeholder={placeholder}
        value={inputValue}
        isOpen={isOpen}
        onChange={changeInput}
        onFocus={open}
      />

      <AutocompleteMenu
        isVisible={showMenu}
        inputValue={inputValue}
        filteredOptions={filteredOptions}
        showAddButton={showAddButton}
        onSelect={handleSelect}
        onAddNew={handleAddNew}
      />

      {multiSelect && selectedItems.length > 0 && (
        <div className={styles.selectedItems}>
          {selectedItems.map((item, index) => (
            <CommonChip
              key={`${item}-${index}`}
              onDelete={() => handleRemoveItem(item)}
            >
              {item}
            </CommonChip>
          ))}
        </div>
      )}
    </div>
  );
}
