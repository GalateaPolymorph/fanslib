import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./index";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "secondary",
        "success",
        "warning",
        "destructive",
        "outline",
        "halfSelected",
      ],
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg"],
    },
    shape: {
      control: { type: "select" },
      options: ["default", "iconOnly"],
    },
  },
  args: {
    children: "Badge",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const HalfSelected: Story = {
  args: {
    variant: "halfSelected",
    children: "Half Selected",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const IconOnly: Story = {
  args: {
    shape: "iconOnly",
    children: "★",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="halfSelected">Half Selected</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const AllShapes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge shape="default">Default</Badge>
      <Badge shape="iconOnly">★</Badge>
    </div>
  ),
};
