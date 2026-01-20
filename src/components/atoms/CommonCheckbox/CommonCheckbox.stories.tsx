import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import CommonCheckbox from "./CommonCheckbox";

const meta = {
  title: "Atoms/CommonCheckbox",
  component: CommonCheckbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "number",
      description: "체크박스 크기 (px)",
    },
    color: {
      control: "select",
      options: ["blue", "red", "white", "grey"],
      description: "체크박스 색상 테마",
    },
    checked: {
      control: "boolean",
      description: "체크 상태",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
  },
  args: { onChange: fn() },
} satisfies Meta<typeof CommonCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Blue: Story = {
  args: {
    color: "blue",
  },
};

export const Red: Story = {
  args: {
    color: "red",
  },
};

export const Grey: Story = {
  args: {
    color: "grey",
  },
};
