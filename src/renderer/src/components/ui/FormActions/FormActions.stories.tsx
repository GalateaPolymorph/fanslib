import type { Meta, StoryObj } from '@storybook/react';
import { Save, X, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '../Button';
import { FormActions } from './FormActions';

const meta: Meta<typeof FormActions> = {
  title: 'Layout/FormActions',
  component: FormActions,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    justify: {
      control: { type: 'select' },
      options: ['start', 'end', 'center', 'between'],
    },
    direction: {
      control: { type: 'select' },
      options: ['row', 'col'],
    },
    spacing: {
      control: { type: 'select' },
      options: ['none', 'sm', 'default', 'lg'],
    },
    responsive: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FormActions {...args}>
      <Button variant="outline">Cancel</Button>
      <Button>Save</Button>
    </FormActions>
  ),
};

export const SaveCancel: Story = {
  render: () => (
    <FormActions>
      <Button variant="outline">
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button>
        <Save className="h-4 w-4 mr-2" />
        Save
      </Button>
    </FormActions>
  ),
};

export const MultipleActions: Story = {
  render: () => (
    <FormActions>
      <Button variant="outline">Cancel</Button>
      <Button variant="secondary">Save Draft</Button>
      <Button>Publish</Button>
    </FormActions>
  ),
};

export const JustifyStart: Story = {
  args: {
    justify: 'start',
  },
  render: (args) => (
    <FormActions {...args}>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
      <Button variant="outline">
        <Upload className="h-4 w-4 mr-2" />
        Import
      </Button>
    </FormActions>
  ),
};

export const JustifyCenter: Story = {
  args: {
    justify: 'center',
  },
  render: (args) => (
    <FormActions {...args}>
      <Button variant="outline">Previous</Button>
      <Button>Next</Button>
    </FormActions>
  ),
};

export const JustifyBetween: Story = {
  args: {
    justify: 'between',
  },
  render: (args) => (
    <FormActions {...args}>
      <Button variant="destructive">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
      <div className="flex space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    </FormActions>
  ),
};

export const ColumnDirection: Story = {
  args: {
    direction: 'col',
  },
  render: (args) => (
    <FormActions {...args}>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="secondary">Save Draft</Button>
    </FormActions>
  ),
};

export const ResponsiveLayout: Story = {
  args: {
    responsive: true,
  },
  render: (args) => (
    <div className="w-full max-w-sm">
      <FormActions {...args}>
        <Button variant="outline">Cancel</Button>
        <Button variant="secondary">Save Draft</Button>
        <Button>Publish</Button>
      </FormActions>
    </div>
  ),
};

export const SmallSpacing: Story = {
  args: {
    spacing: 'sm',
  },
  render: (args) => (
    <FormActions {...args}>
      <Button size="sm" variant="outline">Cancel</Button>
      <Button size="sm">Save</Button>
    </FormActions>
  ),
};

export const LargeSpacing: Story = {
  args: {
    spacing: 'lg',
  },
  render: (args) => (
    <FormActions {...args}>
      <Button size="lg" variant="outline">Cancel</Button>
      <Button size="lg">Save</Button>
    </FormActions>
  ),
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">End Aligned (Default)</h3>
        <FormActions>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </FormActions>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Start Aligned</h3>
        <FormActions justify="start">
          <Button>Create</Button>
          <Button variant="outline">Import</Button>
        </FormActions>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Space Between</h3>
        <FormActions justify="between">
          <Button variant="destructive">Delete</Button>
          <div className="flex space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </div>
        </FormActions>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Column Layout</h3>
        <FormActions direction="col" className="w-48">
          <Button>Primary Action</Button>
          <Button variant="outline">Secondary</Button>
          <Button variant="secondary">Tertiary</Button>
        </FormActions>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Responsive (Resize to see)</h3>
        <div className="w-full max-w-xs">
          <FormActions responsive>
            <Button variant="outline">Cancel</Button>
            <Button variant="secondary">Save Draft</Button>
            <Button>Publish</Button>
          </FormActions>
        </div>
      </div>
    </div>
  ),
};