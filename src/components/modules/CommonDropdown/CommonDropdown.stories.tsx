import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommonDropdown from "./CommonDropdown";
import { useState } from "react";

const meta: Meta<typeof CommonDropdown> = {
  title: "Modules/CommonDropdown",
  component: CommonDropdown,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommonDropdown>;

const fruitOptions = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나" },
  { value: "orange", label: "오렌지" },
  { value: "grape", label: "포도" },
  { value: "strawberry", label: "딸기" },
];

export const WithOnChange: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    const [log, setLog] = useState<string[]>([]);

    const handleChange = (newValue: string) => {
      setValue(newValue);
      setLog((prev) => [...prev, `선택됨: ${newValue}`]);
    };

    return (
      <div>
        <CommonDropdown
          label="선택 로그"
          options={fruitOptions}
          value={value}
          onChange={handleChange}
        />
        <div style={{ marginTop: "16px" }}>
          <strong>로그: String[]</strong>
          <ul>
            {log.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
};
