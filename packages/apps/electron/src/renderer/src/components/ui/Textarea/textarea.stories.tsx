import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./index";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    readOnly: {
      control: { type: "boolean" },
    },
    rows: {
      control: { type: "number" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "This is a textarea with some default content. You can edit this text.",
    placeholder: "Type your message here...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "This textarea is disabled and cannot be edited.",
    placeholder: "Type your message here...",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: "This textarea is read-only. You can select and copy the text, but not edit it.",
  },
};

export const CustomRows: Story = {
  args: {
    rows: 6,
    placeholder: "This textarea has 6 rows instead of the default...",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-[400px]">
      <label htmlFor="message" className="text-sm font-medium">
        Message
      </label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
};

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="space-y-2 w-[400px]">
      <label htmlFor="feedback" className="text-sm font-medium">
        Feedback
      </label>
      <Textarea id="feedback" placeholder="Tell us what you think..." />
      <p className="text-sm text-muted-foreground">Your feedback helps us improve our service.</p>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-[500px]">
      <div>
        <h3 className="text-lg font-medium mb-4">Contact Form</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea id="message" placeholder="Tell us about your inquiry..." rows={4} />
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Send Message
          </button>
        </div>
      </div>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className="w-[500px]">
      <Textarea
        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
        rows={8}
      />
    </div>
  ),
};

export const ResizableHeight: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <label className="text-sm font-medium">Auto-resize Textarea</label>
        <Textarea
          className="resize-none"
          placeholder="This textarea will auto-resize as you type..."
          style={{ minHeight: "80px", maxHeight: "200px" }}
        />
        <p className="text-sm text-muted-foreground">
          CSS resize property is set to none for this example.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Vertically Resizable</label>
        <Textarea className="resize-y" placeholder="This textarea can be resized vertically..." />
        <p className="text-sm text-muted-foreground">
          You can drag the corner to resize vertically.
        </p>
      </div>
    </div>
  ),
};
