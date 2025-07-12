import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./index";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
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
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
};

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-2">
      <Checkbox id="notifications" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="notifications"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email notifications
        </label>
        <p className="text-sm text-muted-foreground">
          You agree to receive notifications about your account.
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
        <Checkbox id="interactive" checked={checked} onCheckedChange={setChecked} />
        <label
          htmlFor="interactive"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Interactive checkbox (click me!)
        </label>
      </div>
    );
  },
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <label htmlFor="option1" className="text-sm font-medium">
          Option 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" defaultChecked />
        <label htmlFor="option2" className="text-sm font-medium">
          Option 2 (default checked)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" disabled />
        <label htmlFor="option3" className="text-sm font-medium">
          Option 3 (disabled)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option4" disabled defaultChecked />
        <label htmlFor="option4" className="text-sm font-medium">
          Option 4 (disabled checked)
        </label>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">Choose how you want to be notified.</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="email" defaultChecked />
          <label htmlFor="email" className="text-sm font-medium">
            Email notifications
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="push" />
          <label htmlFor="push" className="text-sm font-medium">
            Push notifications
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="sms" />
          <label htmlFor="sms" className="text-sm font-medium">
            SMS notifications
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" />
          <label htmlFor="marketing" className="text-sm font-medium">
            Marketing emails
          </label>
        </div>
      </div>
    </div>
  ),
};
