import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toggle } from "./index";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "outline", "ghost", "primary"],
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg"],
    },
    pressed: {
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
    children: "Toggle",
  },
};

export const Pressed: Story = {
  args: {
    children: "Pressed",
    pressed: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary",
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

export const Interactive: Story = {
  render: () => {
    const [pressed, setPressed] = useState(false);

    return (
      <Toggle pressed={pressed} onPressedChange={setPressed}>
        {pressed ? "On" : "Off"}
      </Toggle>
    );
  },
};

export const WithIcon: Story = {
  render: () => (
    <Toggle>
      <span className="mr-2">🔔</span>
      Notifications
    </Toggle>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <Toggle size="sm">
      <span>🔔</span>
    </Toggle>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toggle variant="default">Default</Toggle>
      <Toggle variant="outline">Outline</Toggle>
      <Toggle variant="ghost">Ghost</Toggle>
      <Toggle variant="primary">Primary</Toggle>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="default">Default</Toggle>
      <Toggle size="lg">Large</Toggle>
    </div>
  ),
};

export const ToolbarExample: Story = {
  render: () => {
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);

    return (
      <div className="flex items-center gap-1 p-2 border rounded-md">
        <Toggle pressed={bold} onPressedChange={setBold} size="sm">
          <strong>B</strong>
        </Toggle>
        <Toggle pressed={italic} onPressedChange={setItalic} size="sm">
          <em>I</em>
        </Toggle>
        <Toggle pressed={underline} onPressedChange={setUnderline} size="sm">
          <u>U</u>
        </Toggle>
      </div>
    );
  },
};

export const SettingsToggle: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSave, setAutoSave] = useState(true);

    return (
      <div className="space-y-3 w-[300px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Notifications</span>
          <Toggle
            pressed={notifications}
            onPressedChange={setNotifications}
            variant="primary"
            size="sm"
          >
            {notifications ? "On" : "Off"}
          </Toggle>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Dark Mode</span>
          <Toggle pressed={darkMode} onPressedChange={setDarkMode} variant="primary" size="sm">
            {darkMode ? "On" : "Off"}
          </Toggle>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Auto Save</span>
          <Toggle pressed={autoSave} onPressedChange={setAutoSave} variant="primary" size="sm">
            {autoSave ? "On" : "Off"}
          </Toggle>
        </div>
      </div>
    );
  },
};

export const MultipleStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Toggle>Default</Toggle>
        <Toggle pressed>Pressed</Toggle>
        <Toggle disabled>Disabled</Toggle>
        <Toggle pressed disabled>
          Pressed + Disabled
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Toggle variant="outline">Outline</Toggle>
        <Toggle variant="outline" pressed>
          Outline Pressed
        </Toggle>
        <Toggle variant="outline" disabled>
          Outline Disabled
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Toggle variant="primary">Primary</Toggle>
        <Toggle variant="primary" pressed>
          Primary Pressed
        </Toggle>
        <Toggle variant="primary" disabled>
          Primary Disabled
        </Toggle>
      </div>
    </div>
  ),
};
