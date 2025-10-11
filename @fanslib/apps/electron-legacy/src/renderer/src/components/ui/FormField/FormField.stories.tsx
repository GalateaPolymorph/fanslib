import type { Meta, StoryObj } from "@storybook/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select";
import { Checkbox } from "../Checkbox";
import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Layout/FormField",
  component: FormField,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: { type: "select" },
      options: ["default", "horizontal"],
    },
    required: {
      control: { type: "boolean" },
    },
    error: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    children: <Input placeholder="Enter your email" />,
  },
};

export const WithDescription: Story = {
  args: {
    label: "Username",
    description: "This will be your public display name.",
    children: <Input placeholder="Enter username" />,
  },
};

export const Required: Story = {
  args: {
    label: "Password",
    required: true,
    children: <Input type="password" placeholder="Enter password" />,
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    error: "Please enter a valid email address",
    children: <Input placeholder="Enter your email" className="border-destructive" />,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Bio",
    description: "Tell us a bit about yourself.",
    helperText: "Maximum 500 characters",
    children: <Textarea placeholder="Write your bio..." />,
  },
};

export const HorizontalLayout: Story = {
  args: {
    label: "Full Name",
    layout: "horizontal",
    children: <Input placeholder="John Doe" />,
  },
};

export const WithSelect: Story = {
  args: {
    label: "Country",
    required: true,
    description: "Select your country of residence",
    children: (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
};

export const WithCheckbox: Story = {
  args: {
    label: "Terms and Conditions",
    required: true,
    children: (
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="text-sm">
          I agree to the terms and conditions
        </label>
      </div>
    ),
  },
};

export const PasswordField: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <FormField label="Password" required description="Must be at least 8 characters long">
        <div className="relative">
          <Input type={showPassword ? "text" : "password"} placeholder="Enter password" />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FormField>
    );
  },
};

export const ErrorStates: Story = {
  render: () => (
    <div className="space-y-6">
      <FormField label="Email" error="This field is required" required>
        <Input placeholder="Enter email" className="border-destructive" />
      </FormField>

      <FormField
        label="Username"
        error="Username already exists"
        description="Choose a unique username"
      >
        <Input placeholder="Enter username" className="border-destructive" />
      </FormField>

      <FormField
        label="Phone"
        error="Invalid phone number format"
        helperText="Format: +1 (555) 123-4567"
      >
        <Input placeholder="Enter phone" className="border-destructive" />
      </FormField>
    </div>
  ),
};

export const AllLayouts: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Vertical Layout (Default)</h3>
        <div className="space-y-4 max-w-sm">
          <FormField label="Full Name" required description="Enter your full legal name">
            <Input placeholder="John Doe" />
          </FormField>

          <FormField label="Bio" helperText="Maximum 500 characters">
            <Textarea placeholder="Tell us about yourself..." />
          </FormField>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Horizontal Layout</h3>
        <div className="space-y-4">
          <FormField label="Email" layout="horizontal" required>
            <Input placeholder="john@example.com" />
          </FormField>

          <FormField label="Phone" layout="horizontal" description="Include country code">
            <Input placeholder="+1 (555) 123-4567" />
          </FormField>

          <FormField label="Notifications" layout="horizontal" description="Receive email updates">
            <div className="flex items-center space-x-2">
              <Checkbox id="notifications" />
              <label htmlFor="notifications" className="text-sm">
                Enable notifications
              </label>
            </div>
          </FormField>
        </div>
      </div>
    </div>
  ),
};

export const ComplexForm: Story = {
  render: () => (
    <div className="space-y-6 max-w-lg">
      <FormField
        label="Project Name"
        required
        description="Choose a descriptive name for your project"
      >
        <Input placeholder="My Awesome Project" />
      </FormField>

      <FormField label="Category" required>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">Web Development</SelectItem>
            <SelectItem value="mobile">Mobile App</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        label="Description"
        description="Describe what your project does"
        helperText="This will be visible to collaborators"
      >
        <Textarea placeholder="Enter project description..." />
      </FormField>

      <FormField
        label="Make Private"
        description="Only you and invited collaborators can see this project"
      >
        <div className="flex items-center space-x-2">
          <Checkbox id="private" />
          <label htmlFor="private" className="text-sm">
            Private project
          </label>
        </div>
      </FormField>
    </div>
  ),
};
