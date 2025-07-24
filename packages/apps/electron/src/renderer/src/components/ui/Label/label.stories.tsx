import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../Checkbox";
import { Label } from "./index";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    htmlFor: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label",
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email address</Label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <div className="space-y-2 w-[300px]">
      <Label htmlFor="message">Message</Label>
      <textarea
        id="message"
        placeholder="Enter your message"
        className="w-full px-3 py-2 border rounded-md min-h-[100px]"
      />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-2 w-[300px]">
      <Label htmlFor="username">Username</Label>
      <input
        id="username"
        type="text"
        placeholder="Enter username"
        className="w-full px-3 py-2 border rounded-md"
      />
      <p className="text-sm text-muted-foreground">
        This will be your unique identifier on the platform.
      </p>
    </div>
  ),
};

export const RequiredField: Story = {
  render: () => (
    <div className="space-y-2 w-[300px]">
      <Label htmlFor="required">
        Required Field
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <input
        id="required"
        type="text"
        placeholder="This field is required"
        className="w-full px-3 py-2 border rounded-md"
        required
      />
    </div>
  ),
};

export const DisabledField: Story = {
  render: () => (
    <div className="space-y-2 w-[300px]">
      <Label htmlFor="disabled">Disabled Field</Label>
      <input
        id="disabled"
        type="text"
        value="This field is disabled"
        className="w-full px-3 py-2 border rounded-md"
        disabled
      />
    </div>
  ),
};

export const RadioGroup: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-base">Choose your plan</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input type="radio" id="free" name="plan" value="free" />
          <Label htmlFor="free">Free Plan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="radio" id="pro" name="plan" value="pro" />
          <Label htmlFor="pro">Pro Plan</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="radio" id="enterprise" name="plan" value="enterprise" />
          <Label htmlFor="enterprise">Enterprise Plan</Label>
        </div>
      </div>
    </div>
  ),
};

export const CheckboxGroup: Story = {
  render: () => (
    <div className="space-y-3">
      <Label className="text-base">Select your interests</Label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="tech" />
          <Label htmlFor="tech">Technology</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="design" />
          <Label htmlFor="design">Design</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="business" />
          <Label htmlFor="business">Business</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="marketing" />
          <Label htmlFor="marketing">Marketing</Label>
        </div>
      </div>
    </div>
  ),
};
