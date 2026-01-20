"use client";
import styles from "./style.module.css";
import { useAutocompleteState } from "./hooks/useAutoComplateState";
import { useAutocompleteInput } from "./hooks/useAutocompleteInput";
import { useMultiSelect } from "./hooks/useMultiSelect";
import {
  AutocompleteInput,
  AutocompleteLabel,
  AutocompleteMenu,
  AutocompleteOption,
  AutocompleteSelectedChips,
} from "./component/AutoComplateItems";

export default function CommonAutocomplete({
  label,
  placeholder = "Placeholder",
  options,
  value,
  onChange,
  onAddNew,
  multiSelect = false,
  showAddButton = false,
  selectedItems: externalSelectedItems,
  onSelectedItemsChange,
}: {
  label?: string;
  placeholder?: string;
  options: AutocompleteOption[];
  value?: string;
  onChange?: (v: string) => void;
  onAddNew?: (inputValue: string) => void;
  multiSelect?: boolean;
  showAddButton?: boolean;
  selectedItems?: string[];
  onSelectedItemsChange?: (items: string[]) => void;
}) {
  const { isOpen, open, close, rootRef, inputRef } = useAutocompleteState();

  const { inputValue, setInputValue, filteredOptions, changeInput } =
    useAutocompleteInput({ options, value, onChange });

  const { selectedItems, handleAddNew, handleSelect, handleRemoveItem } =
    useMultiSelect({
      selectedItems: externalSelectedItems,
      onSelectedItemsChange,
      onAddNew,
    });

  const showMenu =
    isOpen &&
    (inputValue.length > 0 || filteredOptions.length > 0 || showAddButton);

  return (
    <div className={styles.autocompleteWrapper} ref={rootRef}>
      {label && <AutocompleteLabel label={label} />}

      <AutocompleteInput
        inputRef={inputRef}
        placeholder={placeholder}
        value={inputValue}
        isOpen={isOpen}
        onChange={(v) => {
          changeInput(v);
          open();
        }}
        onFocus={open}
      />

      <AutocompleteMenu
        isVisible={showMenu}
        inputValue={inputValue}
        options={filteredOptions}
        onSelect={(o) =>
          handleSelect(
            o,
            multiSelect,
            showAddButton,
            setInputValue,
            onChange,
            close,
          )
        }
        showAddButton={showAddButton}
        onAddNew={() =>
          handleAddNew(inputValue, multiSelect, setInputValue, close)
        }
      />

      {multiSelect && selectedItems.length > 0 && (
        <AutocompleteSelectedChips
          items={selectedItems}
          onRemove={handleRemoveItem}
        />
      )}
    </div>
  );
}
