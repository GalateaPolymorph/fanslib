import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./index";

const meta: Meta<typeof Logo> = {
  title: "UI/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: { type: "boolean" },
      description: "Whether to show the full logo or condensed version",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};

export const Sidebar: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-medium mb-2">Expanded Sidebar</h3>
        <div className="w-64 bg-background border rounded-lg p-4">
          <Logo isOpen={true} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Collapsed Sidebar</h3>
        <div className="w-16 bg-background border rounded-lg p-4">
          <Logo isOpen={false} />
        </div>
      </div>
    </div>
  ),
};

export const HeaderExample: Story = {
  render: () => (
    <div className="w-full bg-background border-b p-4">
      <div className="flex items-center justify-between">
        <Logo isOpen={true} />
        <div className="text-sm text-muted-foreground">FansLib v1.0.0</div>
      </div>
    </div>
  ),
};
