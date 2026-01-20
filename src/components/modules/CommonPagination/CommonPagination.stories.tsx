import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CommonPagination from "./CommonPagination";
import { useState } from "react";

const meta: Meta<typeof CommonPagination> = {
  title: "Atoms/CommonPagination",
  component: CommonPagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommonPagination>;

export const Default: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <CommonPagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export const MiddlePage: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);
    return (
      <CommonPagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
      />
    );
  },
};
