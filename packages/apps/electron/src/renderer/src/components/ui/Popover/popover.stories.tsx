import type { Meta, StoryObj } from "@storybook/react";
import { Bell, HelpCircle, Info, Mail, Settings, User } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";
import { Separator } from "../Separator";
import { Popover, PopoverContent, PopoverTrigger } from "./index";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full">
          <User className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div className="grid gap-1">
              <h4 className="font-semibold">Jane Doe</h4>
              <p className="text-sm text-muted-foreground">jane@example.com</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-2">
            <Button variant="outline" className="justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Notifications: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            <Button variant="ghost" size="sm">
              Mark all read
            </Button>
          </div>
          <div className="grid gap-3">
            <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div className="grid gap-1">
                <p className="text-sm font-medium">New message received</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
              <div className="grid gap-1">
                <p className="text-sm">Content scheduled successfully</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-gray-300 mt-2"></div>
              <div className="grid gap-1">
                <p className="text-sm">Analytics report ready</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const HelpTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Label>Content Rating</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-5 w-5">
            <HelpCircle className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium">Content Rating System</h4>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Rate your content based on explicit level:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Safe:</strong> No explicit content
                </li>
                <li>
                  <strong>Suggestive:</strong> Mildly suggestive themes
                </li>
                <li>
                  <strong>Explicit:</strong> Adult content
                </li>
              </ul>
              <p>This helps with proper categorization and audience targeting.</p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const PositionExamples: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-60">
          <p className="text-sm">This popover appears above the trigger.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-60">
          <p className="text-sm">This popover appears to the right of the trigger.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" className="w-60">
          <p className="text-sm">This popover appears below the trigger.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left" className="w-60">
          <p className="text-sm">This popover appears to the left of the trigger.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Start Align</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-60">
          <p className="text-sm">Aligned to the start of the trigger.</p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">End Align</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60">
          <p className="text-sm">Aligned to the end of the trigger.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const FormPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Quick Add Content</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add New Content</h4>
            <p className="text-sm text-muted-foreground">
              Quickly add new content to your library.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Content title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Brief description" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="tag1, tag2, tag3" />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                Save
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const ContextualActions: Story = {
  render: () => (
    <div className="p-8 border border-dashed border-gray-300 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Content Item</h3>
          <p className="text-sm text-muted-foreground">Sample content description</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="grid gap-2">
              <Button variant="ghost" className="justify-start">
                Edit Properties
              </Button>
              <Button variant="ghost" className="justify-start">
                Add to Collection
              </Button>
              <Button variant="ghost" className="justify-start">
                Schedule Post
              </Button>
              <Separator />
              <Button variant="ghost" className="justify-start text-red-600">
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};
