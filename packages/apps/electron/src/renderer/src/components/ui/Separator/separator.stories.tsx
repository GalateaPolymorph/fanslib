import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { Separator } from "./index";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
    decorative: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <Separator />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div className="w-[200px] p-2 border rounded-md">
      <div className="space-y-1">
        <button className="w-full text-left px-2 py-1 text-sm rounded hover:bg-accent">
          Profile
        </button>
        <button className="w-full text-left px-2 py-1 text-sm rounded hover:bg-accent">
          Settings
        </button>
        <button className="w-full text-left px-2 py-1 text-sm rounded hover:bg-accent">
          Billing
        </button>
      </div>
      <Separator className="my-2" />
      <div className="space-y-1">
        <button className="w-full text-left px-2 py-1 text-sm rounded hover:bg-accent">Help</button>
        <button className="w-full text-left px-2 py-1 text-sm rounded hover:bg-accent text-red-600">
          Logout
        </button>
      </div>
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="w-[300px] p-4 border rounded-lg">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">User Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Email:</span> john@example.com
        </p>
        <p className="text-sm">
          <span className="font-medium">Role:</span> Administrator
        </p>
        <p className="text-sm">
          <span className="font-medium">Last Login:</span> 2 hours ago
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex space-x-2">
        <Button size="sm">Edit Profile</Button>
        <Button size="sm" variant="outline">
          Change Password
        </Button>
      </div>
    </div>
  ),
};

export const InNavigation: Story = {
  render: () => (
    <div className="w-[400px] p-4 border rounded-lg">
      <nav className="space-y-2">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Navigation
          </h4>
          <div className="space-y-1">
            <a href="#" className="block px-2 py-1 text-sm rounded hover:bg-accent">
              Dashboard
            </a>
            <a href="#" className="block px-2 py-1 text-sm rounded hover:bg-accent">
              Analytics
            </a>
            <a href="#" className="block px-2 py-1 text-sm rounded hover:bg-accent">
              Reports
            </a>
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Account
          </h4>
          <div className="space-y-1">
            <a href="#" className="block px-2 py-1 text-sm rounded hover:bg-accent">
              Profile
            </a>
            <a href="#" className="block px-2 py-1 text-sm rounded hover:bg-accent">
              Settings
            </a>
            <a href="#" className="block px-2 py-1 text-sm rounded hover:bg-accent">
              Billing
            </a>
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Support
          </h4>
          <div className="space-y-1">
            <a href="#" className="block px-2 py-1 text-sm rounded hover:bg-accent">
              Help Center
            </a>
            <a href="#" className="block px-2 py-1 text-sm rounded hover:bg-accent">
              Contact Us
            </a>
          </div>
        </div>
      </nav>
    </div>
  ),
};

export const InBreadcrumb: Story = {
  render: () => (
    <div className="flex items-center space-x-2 text-sm">
      <a href="#" className="hover:underline">
        Home
      </a>
      <Separator orientation="vertical" />
      <a href="#" className="hover:underline">
        Dashboard
      </a>
      <Separator orientation="vertical" />
      <a href="#" className="hover:underline">
        Analytics
      </a>
      <Separator orientation="vertical" />
      <span className="text-muted-foreground">Reports</span>
    </div>
  ),
};

export const InToolbar: Story = {
  render: () => (
    <div className="flex items-center space-x-2 p-2 border rounded-md">
      <Button size="sm" variant="outline">
        Bold
      </Button>
      <Button size="sm" variant="outline">
        Italic
      </Button>
      <Button size="sm" variant="outline">
        Underline
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button size="sm" variant="outline">
        Left
      </Button>
      <Button size="sm" variant="outline">
        Center
      </Button>
      <Button size="sm" variant="outline">
        Right
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button size="sm" variant="outline">
        Link
      </Button>
    </div>
  ),
};
