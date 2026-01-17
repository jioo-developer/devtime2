import React, { useState } from "react";
import CommonAutocomplete from "@/components/atoms/CommonAutocomplete/CommonAutocomplete";
import CommonBadge from "@/components/atoms/CommonBadge/CommonBadge";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import CommonCheckbox from "@/components/atoms/CommonCheckbox/CommonCheckbox";
import CommonChip from "@/components/atoms/CommonChip/CommonChip";
import CommonDropdown from "@/components/atoms/CommonDropdown/CommonDropdown";
import CommonInput from "@/components/atoms/CommonInput/CommonInput";
import CommonPagination from "@/components/atoms/CommonPagination/CommonPagination";
import { AutoResizeTextarea } from "@/components/atoms/CommonTextArea/CommonTextArea";
import CommonTooltip from "@/components/atoms/CommonTooltip/CommonTooltip";
import styles from "./componentTab.module.css";

export default function AtomsTab() {
  const [dropdownValue, setDropdownValue] = useState("");
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const dropdownOptions = [
    { value: "1", label: "First Item" },
    { value: "2", label: "Second Item" },
    { value: "3", label: "Third Item" },
    { value: "4", label: "Fourth Item" },
    { value: "5", label: "Fifth Item" },
  ];

  const autocompleteOptions = [
    { value: "1", label: "AABC" },
    { value: "2", label: "AABBYF" },
    { value: "3", label: "AACDDFG" },
    { value: "4", label: "AAGHR" },
    { value: "5", label: "AAATHCHYYU" },
  ];

  return (
    <div className={styles.tabContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonBadge</h2>
        <div className={styles.componentBox}>
          <div className={styles.row}>
            <CommonBadge text="Primary" variant="primary" size="small" />
            <CommonBadge text="Primary" variant="primary" size="medium" />
            <CommonBadge text="Primary" variant="primary" size="large" />
          </div>
          <div className={styles.row}>
            <CommonBadge text="Secondary" variant="secondary" size="small" />
            <CommonBadge text="Secondary" variant="secondary" size="medium" />
            <CommonBadge text="Secondary" variant="secondary" size="large" />
          </div>
          <div className={styles.row}>
            <CommonBadge text="Gray" variant="gray" size="small" />
            <CommonBadge text="Gray" variant="gray" size="medium" />
            <CommonBadge text="Gray" variant="gray" size="large" />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonButton</h2>
        <div className={styles.componentBox}>
          <div className={styles.row}>
            <CommonButton theme="primary" width={155} height={44}>
              Primary Button
            </CommonButton>
            <CommonButton theme="secondary" width={180} height={44}>
              Secondary Button
            </CommonButton>
            <CommonButton theme="tertiary" width={170} height={44}>
              Tertiary Button
            </CommonButton>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonCheckbox</h2>
        <div className={styles.componentBox}>
          <CommonCheckbox
            stateValue={checkboxValue}
            setStateHandler={setCheckboxValue}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonChip</h2>
        <div className={styles.componentBox}>
          <div className={styles.row}>
            <CommonChip>Chip 1</CommonChip>
            <CommonChip>Chip 2</CommonChip>
            <CommonChip onDelete={() => console.log("Delete")}>
              Chip with Delete
            </CommonChip>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonDropdown</h2>
        <div className={styles.componentBox}>
          <CommonDropdown
            label="Dropdown Label"
            placeholder="Select an option"
            options={dropdownOptions}
            value={dropdownValue}
            onChange={setDropdownValue}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonAutocomplete</h2>
        <div className={styles.componentBox}>
          <CommonAutocomplete
            label="Autocomplete Label"
            placeholder="Search..."
            options={autocompleteOptions}
            value={autocompleteValue}
            onChange={setAutocompleteValue}
            showAddButton
            multiSelect
            onAddNew={(value) => console.log("Add:", value)}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonInput</h2>
        <div className={styles.componentBox}>
          <CommonInput
            id="testInput"
            label="Input Label"
            placeholder="Enter text..."
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonTextArea</h2>
        <div className={styles.componentBox}>
          <AutoResizeTextarea
            label="Textarea Label"
            placeholder="Enter long text..."
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonPagination</h2>
        <div className={styles.componentBox}>
          <CommonPagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CommonTooltip</h2>
        <div className={styles.componentBox}>
          <CommonTooltip content="This is a tooltip message">
            <button className={styles.tooltipButton}>Hover me</button>
          </CommonTooltip>
        </div>
      </section>
    </div>
  );
}
