import type { Meta, StoryObj } from "@storybook/react";
import { PlusCircle, Settings } from "lucide-react";
import { Button } from "../Button";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Layout/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    spacing: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "xl"],
    },
    titleSize: {
      control: { type: "select" },
      options: ["default", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Page Title",
  },
};

export const WithDescription: Story = {
  args: {
    title: "Analytics Dashboard",
    description: "Track your content performance and engagement metrics",
  },
};

export const WithSingleAction: Story = {
  args: {
    title: "Channels",
    description: "Manage your content distribution channels",
    actions: (
      <Button variant="secondary">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Channel
      </Button>
    ),
  },
};

export const WithMultipleActions: Story = {
  args: {
    title: "Media Library",
    description: "Browse and organize your content",
    actions: (
      <>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="secondary">
          <PlusCircle className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </>
    ),
  },
};

export const LargeTitle: Story = {
  args: {
    title: "Welcome to FansLib",
    titleSize: "xl",
    description: "Your comprehensive content management platform",
    spacing: "xl",
  },
};

export const CompactSpacing: Story = {
  args: {
    title: "Quick Actions",
    spacing: "sm",
    actions: (
      <Button variant="secondary" size="sm">
        Action
      </Button>
    ),
  },
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <PageHeader title="Default Header" spacing="sm" />
      <PageHeader title="With Description" description="A subtitle or description goes here" />
      <PageHeader
        title="With Action Button"
        actions={
          <Button variant="secondary">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        }
      />
      <PageHeader
        title="Large Title"
        titleSize="lg"
        description="A larger title with description"
        actions={<Button variant="secondary">Action</Button>}
        spacing="lg"
      />
    </div>
  ),
};
