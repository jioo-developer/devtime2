import { useEffect, useMemo, useState } from "react";
import { AutocompleteOption } from "../component/AutoComplateItems";

type Params = {
  options: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
};

export function useAutocompleteInput({ options, value, onChange }: Params) {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const filteredOptions = useMemo(() => {
    const q = inputValue.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, inputValue]);

  const changeInput = (next: string) => {
    setInputValue(next);
    onChange?.(next);
  };

  return {
    inputValue,
    setInputValue,
    filteredOptions,
    changeInput,
  };
}
