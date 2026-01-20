import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import TodoListItem from "./TodoList";

const meta = {
  title: "Modules/TodoListItem",
  component: TodoListItem,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Todo 항목 텍스트",
    },
    initialStatus: {
      control: "select",
      options: [
        "active",
        "typing",
        "empty",
        "completed",
        "default",
        "disabled",
      ],
      description: "초기 상태",
    },
  },
  args: {
    onTextChange: fn(),
    onStatusChange: fn(),
    onDelete: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: "600px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TodoListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Learn React Hooks",
    initialStatus: "default",
  },
};

export const Active: Story = {
  args: {
    text: "Build awesome UI components",
    initialStatus: "active",
  },
};

export const Disabled: Story = {
  args: {
    text: "Review pull requests",
    initialStatus: "disabled",
  },
};

export const Typing: Story = {
  args: {
    text: "Writing documentation...",
    initialStatus: "typing",
  },
};
