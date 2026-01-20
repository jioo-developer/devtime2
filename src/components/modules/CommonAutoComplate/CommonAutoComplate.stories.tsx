import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommonAutocomplete from "./CommonAutoComplate";
import { useState } from "react";

const meta: Meta<typeof CommonAutocomplete> = {
  title: "Modules/CommonAutocomplete",
  component: CommonAutocomplete,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommonAutocomplete>;

const fruits = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나" },
  { value: "orange", label: "오렌지" },
  { value: "grape", label: "포도" },
  { value: "strawberry", label: "딸기" },
  { value: "watermelon", label: "수박" },
  { value: "melon", label: "멜론" },
  { value: "peach", label: "복숭아" },
  { value: "pear", label: "배" },
  { value: "cherry", label: "체리" },
];

export const MultiSelectWithAddButton: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    return (
      <CommonAutocomplete
        label="다중 선택 (Add 버튼)"
        placeholder="과일을 선택하세요"
        options={fruits}
        multiSelect={true}
        showAddButton={true}
        selectedItems={selectedItems}
        onSelectedItemsChange={setSelectedItems}
      />
    );
  },
};
