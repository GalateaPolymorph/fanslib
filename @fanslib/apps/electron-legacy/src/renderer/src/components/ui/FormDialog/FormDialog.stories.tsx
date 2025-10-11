import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";
import { Textarea } from "../Textarea";
import { FormDialog } from "./FormDialog";

const meta: Meta<typeof FormDialog> = {
  title: "Layout/FormDialog",
  component: FormDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl", "2xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const FormDialogTemplate = (args: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Open Dialog
      </Button>
      <FormDialog {...args} open={open} onOpenChange={setOpen} />
    </>
  );
};

export const Default: Story = {
  render: () => (
    <FormDialogTemplate
      title="Create New Item"
      description="Fill out the form below to create a new item."
      footer={
        <>
          <Button variant="outline">Cancel</Button>
          <Button>Create</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter item name" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Enter description" />
        </div>
      </div>
    </FormDialogTemplate>
  ),
};

export const SimpleForm: Story = {
  render: () => (
    <FormDialogTemplate
      title="Quick Add"
      footer={
        <>
          <Button variant="outline">Cancel</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </>
      }
    >
      <div>
        <Label htmlFor="quick-name">Item Name</Label>
        <Input id="quick-name" placeholder="Enter name" />
      </div>
    </FormDialogTemplate>
  ),
};

export const LargeForm: Story = {
  render: () => (
    <FormDialogTemplate
      title="User Profile"
      description="Update your profile information below."
      maxWidth="xl"
      footer={
        <>
          <Button variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button variant="secondary">Save Draft</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" placeholder="John" />
          </div>
          <div>
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" placeholder="Doe" />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell us about yourself" />
        </div>
      </div>
    </FormDialogTemplate>
  ),
};

export const SmallDialog: Story = {
  render: () => (
    <FormDialogTemplate
      title="Confirm Action"
      description="Are you sure you want to proceed?"
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Confirm</Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
    </FormDialogTemplate>
  ),
};

export const NoDescription: Story = {
  render: () => (
    <FormDialogTemplate
      title="Settings"
      footer={
        <>
          <Button variant="outline">Cancel</Button>
          <Button>Apply</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="notifications" />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="auto-save" />
          <Label htmlFor="auto-save">Auto-save changes</Label>
        </div>
      </div>
    </FormDialogTemplate>
  ),
};

export const NoFooter: Story = {
  render: () => (
    <FormDialogTemplate
      title="Information"
      description="This is an informational dialog with no actions."
    >
      <div className="space-y-2">
        <p className="text-sm">Here&apos;s some important information you should know.</p>
        <p className="text-sm text-muted-foreground">
          Click outside or press Escape to close this dialog.
        </p>
      </div>
    </FormDialogTemplate>
  ),
};

export const AllSizes: Story = {
  render: () => {
    const [activeDialog, setActiveDialog] = useState<string | null>(null);

    const sizes = [
      { key: "sm", label: "Small", maxWidth: "sm" as const },
      { key: "md", label: "Medium", maxWidth: "md" as const },
      { key: "lg", label: "Large", maxWidth: "lg" as const },
      { key: "xl", label: "Extra Large", maxWidth: "xl" as const },
      { key: "2xl", label: "2X Large", maxWidth: "2xl" as const },
    ];

    return (
      <div className="space-x-2">
        {sizes.map((size) => (
          <Button key={size.key} variant="outline" onClick={() => setActiveDialog(size.key)}>
            {size.label}
          </Button>
        ))}

        {sizes.map((size) => (
          <FormDialog
            key={size.key}
            open={activeDialog === size.key}
            onOpenChange={(open) => !open && setActiveDialog(null)}
            title={`${size.label} Dialog`}
            description={`This is a ${size.label.toLowerCase()} dialog example.`}
            maxWidth={size.maxWidth}
            footer={
              <>
                <Button variant="outline" onClick={() => setActiveDialog(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setActiveDialog(null)}>OK</Button>
              </>
            }
          >
            <p className="text-sm">
              Dialog content goes here. The width is set to {size.maxWidth}.
            </p>
          </FormDialog>
        ))}
      </div>
    );
  },
};
