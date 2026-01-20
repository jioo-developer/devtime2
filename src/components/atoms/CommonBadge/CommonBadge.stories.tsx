import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommonBadge from "./CommonBadge";

const meta: Meta<typeof CommonBadge> = {
  title: "Atoms/CommonBadge",
  component: CommonBadge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommonBadge>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <CommonBadge text="Small" variant="primary" size="small" />
        <CommonBadge text="Medium" variant="primary" size="medium" />
        <CommonBadge text="Large" variant="primary" size="large" />
      </div>
    </div>
  ),
};
