import type { Meta, StoryObj } from '@storybook/react';
import { FolderOpen, Plus, ImageIcon, Users, Calendar, Search } from 'lucide-react';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Layout/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'xl'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <FolderOpen className="h-12 w-12" />,
    title: 'No items found',
    description: 'Get started by creating your first item.',
  },
};

export const WithAction: Story = {
  args: {
    icon: <ImageIcon className="h-12 w-12" />,
    title: 'No media files',
    description: 'Upload your first image or video to get started.',
    action: (
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Upload Media
      </Button>
    ),
  },
};

export const CompactSize: Story = {
  args: {
    icon: <Users className="h-8 w-8" />,
    title: 'No members',
    description: 'Invite people to join your team.',
    padding: 'sm',
    size: 'default',
    action: (
      <Button variant="outline" size="sm">
        Invite Members
      </Button>
    ),
  },
};

export const LargeSize: Story = {
  args: {
    icon: <Calendar className="h-16 w-16" />,
    title: 'No scheduled posts',
    description: 'Create your first scheduled post to automate your content publishing.',
    padding: 'xl',
    size: 'lg',
    action: (
      <Button size="lg">
        <Plus className="h-5 w-5 mr-2" />
        Schedule Post
      </Button>
    ),
  },
};

export const SearchResults: Story = {
  args: {
    icon: <Search className="h-12 w-12" />,
    title: 'No results found',
    description: 'Try adjusting your search criteria or browse all items.',
    action: (
      <Button variant="outline">
        Clear Filters
      </Button>
    ),
  },
};

export const MultipleActions: Story = {
  render: () => (
    <EmptyState
      icon={<FolderOpen className="h-12 w-12" />}
      title="No projects yet"
      description="Create your first project or import from an existing source."
    >
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
        <Button variant="outline">
          Import Project
        </Button>
      </div>
    </EmptyState>
  ),
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small Padding</h3>
        <EmptyState
          icon={<FolderOpen className="h-8 w-8" />}
          title="Small Empty State"
          description="With minimal padding"
          padding="sm"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Default</h3>
        <EmptyState
          icon={<ImageIcon className="h-12 w-12" />}
          title="Default Empty State"
          description="Standard spacing and sizing"
          action={<Button variant="outline">Action</Button>}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Large</h3>
        <EmptyState
          icon={<Calendar className="h-16 w-16" />}
          title="Large Empty State"
          description="More prominent with extra spacing"
          padding="lg"
          size="lg"
          action={<Button size="lg">Large Action</Button>}
        />
      </div>
    </div>
  ),
};