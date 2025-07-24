import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "./index";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <label
        htmlFor="airplane-mode"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Airplane mode
      </label>
    </div>
  ),
};

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-2">
      <Switch id="notifications" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="notifications"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Push notifications
        </label>
        <p className="text-sm text-muted-foreground">
          Receive notifications about new messages and updates.
        </p>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <div className="flex items-center space-x-2">
        <Switch id="interactive" checked={checked} onCheckedChange={setChecked} />
        <label
          htmlFor="interactive"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Interactive switch (click me!)
        </label>
      </div>
    );
  },
};

export const SettingsExample: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <div>
        <h3 className="text-lg font-medium mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="marketing" className="text-sm font-medium">
                Marketing emails
              </label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new products and features.
              </p>
            </div>
            <Switch id="marketing" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="security" className="text-sm font-medium">
                Security emails
              </label>
              <p className="text-sm text-muted-foreground">
                Receive emails about your account security.
              </p>
            </div>
            <Switch id="security" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label htmlFor="updates" className="text-sm font-medium">
                Product updates
              </label>
              <p className="text-sm text-muted-foreground">
                Get notified when we ship new features.
              </p>
            </div>
            <Switch id="updates" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const MultipleSwitches: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="option1" />
        <label htmlFor="option1" className="text-sm font-medium">
          Option 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="option2" defaultChecked />
        <label htmlFor="option2" className="text-sm font-medium">
          Option 2 (default checked)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="option3" disabled />
        <label htmlFor="option3" className="text-sm font-medium">
          Option 3 (disabled)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="option4" disabled defaultChecked />
        <label htmlFor="option4" className="text-sm font-medium">
          Option 4 (disabled checked)
        </label>
      </div>
    </div>
  ),
};
