import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Settings } from "lucide-react";
import { Button } from "../Button";
import { SectionHeader } from "../SectionHeader/SectionHeader";

const meta: Meta<typeof SectionHeader> = {
  title: "Layout/SectionHeader",
  component: SectionHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    spacing: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "none"],
    },
    titleSize: {
      control: { type: "select" },
      options: ["default", "sm", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Recent Activity",
  },
};

export const WithDescription: Story = {
  args: {
    title: "Media Gallery",
    description: "Your uploaded content and assets",
  },
};

export const WithAction: Story = {
  args: {
    title: "Scheduled Posts",
    description: "Content scheduled for future publishing",
    actions: (
      <Button variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Post
      </Button>
    ),
  },
};

export const WithMultipleActions: Story = {
  args: {
    title: "Analytics",
    description: "Performance metrics and insights",
    actions: (
      <>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm">
          Export Data
        </Button>
      </>
    ),
  },
};

export const Variations: Story = {
  render: () => (
    <div className="space-y-6">
      <SectionHeader title="Small Section" titleSize="sm" spacing="sm" />
      <SectionHeader title="Default Section" description="With standard sizing" />
      <SectionHeader
        title="Large Section"
        titleSize="lg"
        description="With larger title and spacing"
        spacing="lg"
        actions={
          <Button variant="outline" size="sm">
            Action
          </Button>
        }
      />
    </div>
  ),
};
