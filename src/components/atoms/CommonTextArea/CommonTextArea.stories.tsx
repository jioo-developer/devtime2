import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommonTextArea } from "./CommonTextArea";

const meta: Meta<typeof CommonTextArea> = {
  title: "Atoms/CommonTextArea",
  component: CommonTextArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommonTextArea>;

export const Default: Story = {
  render: () => <CommonTextArea placeholder="텍스트를 입력하세요" />,
};

export const WithLabel: Story = {
  render: () => <CommonTextArea label="설명" placeholder="설명을 입력하세요" />,
};

export const WithError: Story = {
  render: () => (
    <CommonTextArea
      label="내용"
      placeholder="내용을 입력하세요"
      error="필수 입력 항목입니다"
    />
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <CommonTextArea
      label="내용"
      defaultValue="이것은 기본 텍스트입니다.
여러 줄의 텍스트가 자동으로 높이를 조절합니다."
      placeholder="내용을 입력하세요"
    />
  ),
};
