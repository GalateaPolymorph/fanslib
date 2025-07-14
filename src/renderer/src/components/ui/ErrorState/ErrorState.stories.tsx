import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, Server, FileX, ShieldAlert } from 'lucide-react';
import { Button } from '../Button';
import { 
  ErrorState, 
  NetworkErrorState, 
  GenericErrorState, 
  NotFoundErrorState 
} from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'Layout/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'xl'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'muted'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred while processing your request.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
  },
};

export const CustomIcon: Story = {
  args: {
    icon: <Server className="h-12 w-12" />,
    title: 'Server Error',
    description: 'Our servers are currently experiencing issues. Please try again later.',
    showRetry: true,
    onRetry: () => console.log('Retry clicked'),
    retryText: 'Retry Request',
  },
};

export const WithCustomAction: Story = {
  args: {
    icon: <ShieldAlert className="h-12 w-12" />,
    title: 'Access Denied',
    description: 'You do not have permission to access this resource.',
    action: (
      <Button variant="outline">
        Request Access
      </Button>
    ),
  },
};

export const MutedVariant: Story = {
  args: {
    icon: <FileX className="h-12 w-12" />,
    title: 'File not found',
    description: 'The file you are looking for has been moved or deleted.',
    variant: 'muted',
  },
};

export const NetworkError: Story = {
  render: () => (
    <NetworkErrorState 
      onRetry={() => console.log('Network retry clicked')}
    />
  ),
};

export const GenericError: Story = {
  render: () => (
    <GenericErrorState 
      onRetry={() => console.log('Generic retry clicked')}
    />
  ),
};

export const NotFoundError: Story = {
  render: () => (
    <NotFoundErrorState 
      resourceName="Page"
    />
  ),
};

export const NotFoundCustomResource: Story = {
  render: () => (
    <NotFoundErrorState 
      resourceName="Media File"
      action={
        <Button variant="outline">
          Browse Library
        </Button>
      }
    />
  ),
};

export const MultipleActions: Story = {
  render: () => (
    <ErrorState
      icon={<AlertCircle className="h-12 w-12" />}
      title="Upload Failed"
      description="The file could not be uploaded due to a network error."
    >
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button variant="outline" onClick={() => console.log('Retry')}>
          Try Again
        </Button>
        <Button variant="outline" onClick={() => console.log('Choose different file')}>
          Choose Different File
        </Button>
      </div>
    </ErrorState>
  ),
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Network Error</h3>
        <NetworkErrorState onRetry={() => console.log('Network retry')} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Generic Error</h3>
        <GenericErrorState onRetry={() => console.log('Generic retry')} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Not Found (Muted)</h3>
        <NotFoundErrorState resourceName="Project" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Error</h3>
        <ErrorState
          icon={<Server className="h-12 w-12" />}
          title="Server Maintenance"
          description="We're performing scheduled maintenance. Service will be restored shortly."
          padding="sm"
          variant="muted"
        />
      </div>
    </div>
  ),
};