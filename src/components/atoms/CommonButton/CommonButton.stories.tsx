import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import CommonButton from "./CommonButton";

const meta = {
  title: "Atoms/CommonButton",
  component: CommonButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "disable",
        "none",
        "overlap",
      ],
      description: "버튼의 테마 스타일",
    },
    fontSize: {
      control: "select",
      options: [
        "heading",
        "title",
        "subtitle",
        "body",
        "bodySmall",
        "caption",
        "label",
      ],
      description: "버튼 폰트 크기",
    },
    width: {
      control: "text",
      description: "버튼 너비 (숫자 또는 문자열)",
    },
    height: {
      control: "text",
      description: "버튼 높이 (숫자 또는 문자열)",
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof CommonButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary 테마 스토리들
export const Primary: Story = {
  args: {
    theme: "primary",
    children: "Primary Button",
  },
};

// Secondary 테마
export const Secondary: Story = {
  args: {
    theme: "secondary",
    children: "Secondary Button",
  },
};

// Tertiary 테마
export const Tertiary: Story = {
  args: {
    theme: "tertiary",
    children: "Tertiary Button",
  },
};

// Overlap 테마
export const Overlap: Story = {
  args: {
    theme: "overlap",
    children: "Overlap Button",
  },
};

// Disable 테마
export const Disabled: Story = {
  args: {
    theme: "disable",
    children: "Disabled Button",
    disabled: true,
  },
};
