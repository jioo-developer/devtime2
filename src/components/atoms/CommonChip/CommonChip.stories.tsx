import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommonChip from "./CommonChip";

const meta: Meta<typeof CommonChip> = {
  title: "Atoms/CommonChip",
  component: CommonChip,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommonChip>;

export const OutlinedSmall: Story = {
  render: () => (
    <CommonChip size="sm" variant="outlined">
      Small Chip
    </CommonChip>
  ),
};

export const WithDelete: Story = {
  render: () => (
    <CommonChip
      size="md"
      variant="outlined"
      onDelete={() => alert("Delete clicked")}
    >
      Deletable Chip
    </CommonChip>
  ),
};
