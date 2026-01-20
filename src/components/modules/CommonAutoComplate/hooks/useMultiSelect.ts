import { useState } from "react";
import { AutocompleteOption } from "../component/AutoComplateItems";

type UseMultiSelectParams = {
  selectedItems?: string[];
  onSelectedItemsChange?: (items: string[]) => void;
  onAddNew?: (inputValue: string) => void;
};

export function useMultiSelect({
  selectedItems: externalSelectedItems,
  onSelectedItemsChange,
  onAddNew,
}: UseMultiSelectParams) {
  const [internalSelectedItems, setInternalSelectedItems] = useState<string[]>(
    [],
  );

  const selectedItems = externalSelectedItems ?? internalSelectedItems;
  const setSelectedItems = onSelectedItemsChange ?? setInternalSelectedItems;

  const handleAddNew = (
    inputValue: string,
    multiSelect: boolean,
    setInputValue: (v: string) => void,
    close: () => void,
  ) => {
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

  const handleSelect = (
    option: AutocompleteOption,
    multiSelect: boolean,
    showAddButton: boolean,
    setInputValue: (v: string) => void,
    onChange?: (v: string) => void,
    close?: () => void,
  ) => {
    if (multiSelect) {
      if (showAddButton) {
        setInputValue(option.label);
      } else {
        if (!selectedItems.includes(option.label)) {
          setSelectedItems([...selectedItems, option.label]);
        }
        setInputValue("");
      }
    } else {
      setInputValue(option.label);
      onChange?.(option.label);
      close?.();
    }
  };

  const handleRemoveItem = (item: string) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  return {
    selectedItems,
    handleAddNew,
    handleSelect,
    handleRemoveItem,
  };
}
