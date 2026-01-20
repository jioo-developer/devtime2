import { MdAdd } from "react-icons/md";
import styles from "../style.module.css";
import CommonChip from "../../../atoms/CommonChip/CommonChip";
export type AutocompleteOption = {
  value: string;
  label: string;
};

export function HighlightMatch({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query) return <>{text}</>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  return (
    <>
      {text.split(regex).map((part, index) =>
        regex.test(part) ? (
          <strong key={index} className={styles.highlight}>
            {part}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function AutocompleteLabel({ label }: { label: string }) {
  return <label className={styles.label}>{label}</label>;
}

export function AutocompleteInput({
  inputRef,
  placeholder,
  value,
  isOpen,
  onChange,
  onFocus,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  placeholder: string;
  value: string;
  isOpen: boolean;
  onChange: (v: string) => void;
  onFocus: () => void;
}) {
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
  options,
  onSelect,
  showAddButton,
  onAddNew,
}: {
  isVisible: boolean;
  inputValue: string;
  options: { value: string; label: string }[];
  onSelect: (option: { value: string; label: string }) => void;
  showAddButton: boolean;
  onAddNew: () => void;
}) {
  if (!isVisible) return null;

  return (
    <div className={styles.menu}>
      {options.length > 0 && (
        <ul className={styles.list}>
          {options.map((option) => (
            <li
              key={option.value}
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

export function AutocompleteSelectedChips({
  items,
  onRemove,
}: {
  items: string[];
  onRemove: (item: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className={styles.selectedItems}>
      {items.map((item) => (
        <CommonChip key={item} onDelete={() => onRemove(item)}>
          {item}
        </CommonChip>
      ))}
    </div>
  );
}
