import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ImageUploader from "./ImageUploder";

const meta: Meta<typeof ImageUploader> = {
  title: "Modules/ImageUploader",
  component: ImageUploader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "업로드 필드의 레이블",
    },
    maxSize: {
      control: "number",
      description: "최대 파일 크기 (MB)",
    },
    acceptedFormats: {
      control: "object",
      description: "허용된 파일 형식 배열",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImageUploader>;

// 기본 스토리
export const Default: Story = {
  args: {
    label: "이미지 업로드",
    maxSize: 5,
    acceptedFormats: [".png", ".jpg", ".jpeg"],
  },
};
