import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card';
import { PageContainer } from './PageContainer';

const meta: Meta<typeof PageContainer> = {
  title: 'Layout/PageContainer',
  component: PageContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'default', 'lg'],
    },
    spacing: {
      control: { type: 'select' },
      options: ['none', 'sm', 'default', 'lg'],
    },
    maxWidth: {
      control: { type: 'select' },
      options: ['default', 'sm', 'md', 'lg', 'xl', 'full'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <>
    <h1 className="text-3xl font-bold">Page Title</h1>
    <p className="text-muted-foreground">
      This is sample content to demonstrate the page container layout.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Card {i + 1}</CardTitle>
            <CardDescription>Sample card content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is some example content for the card.
            </p>
            <Button className="mt-2" size="sm">
              Action
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

export const Default: Story = {
  render: () => (
    <PageContainer>
      <SampleContent />
    </PageContainer>
  ),
};

export const NoPadding: Story = {
  render: () => (
    <PageContainer padding="none">
      <div className="p-4 bg-muted">
        <h2 className="text-xl font-semibold mb-2">No Padding Container</h2>
        <p>The container has no default padding, so content touches the edges.</p>
      </div>
      <div className="p-4">
        <SampleContent />
      </div>
    </PageContainer>
  ),
};

export const SmallPadding: Story = {
  render: () => (
    <PageContainer padding="sm">
      <div className="p-2 bg-muted rounded mb-4">
        <p className="text-sm">Small padding container</p>
      </div>
      <SampleContent />
    </PageContainer>
  ),
};

export const LargePadding: Story = {
  render: () => (
    <PageContainer padding="lg">
      <div className="p-2 bg-muted rounded mb-4">
        <p className="text-sm">Large padding container</p>
      </div>
      <SampleContent />
    </PageContainer>
  ),
};

export const NoSpacing: Story = {
  render: () => (
    <PageContainer spacing="none">
      <div className="bg-primary text-primary-foreground p-4 rounded">
        Section 1 - No automatic spacing
      </div>
      <div className="bg-secondary text-secondary-foreground p-4 rounded">
        Section 2 - Elements will touch without manual spacing
      </div>
      <div className="bg-muted p-4 rounded">
        Section 3 - Add your own spacing as needed
      </div>
    </PageContainer>
  ),
};

export const SmallSpacing: Story = {
  render: () => (
    <PageContainer spacing="sm">
      <div className="bg-primary text-primary-foreground p-4 rounded">
        Section 1 - Small spacing
      </div>
      <div className="bg-secondary text-secondary-foreground p-4 rounded">
        Section 2 - Compact layout
      </div>
      <div className="bg-muted p-4 rounded">
        Section 3 - Minimal gaps
      </div>
    </PageContainer>
  ),
};

export const LargeSpacing: Story = {
  render: () => (
    <PageContainer spacing="lg">
      <div className="bg-primary text-primary-foreground p-4 rounded">
        Section 1 - Large spacing
      </div>
      <div className="bg-secondary text-secondary-foreground p-4 rounded">
        Section 2 - More breathing room
      </div>
      <div className="bg-muted p-4 rounded">
        Section 3 - Generous gaps
      </div>
    </PageContainer>
  ),
};

export const SmallMaxWidth: Story = {
  render: () => (
    <PageContainer maxWidth="sm">
      <div className="bg-muted p-4 rounded mb-4 text-center">
        <p className="text-sm">Small max width (max-w-2xl)</p>
      </div>
      <SampleContent />
    </PageContainer>
  ),
};

export const MediumMaxWidth: Story = {
  render: () => (
    <PageContainer maxWidth="md">
      <div className="bg-muted p-4 rounded mb-4 text-center">
        <p className="text-sm">Medium max width (max-w-4xl)</p>
      </div>
      <SampleContent />
    </PageContainer>
  ),
};

export const LargeMaxWidth: Story = {
  render: () => (
    <PageContainer maxWidth="lg">
      <div className="bg-muted p-4 rounded mb-4 text-center">
        <p className="text-sm">Large max width (max-w-6xl)</p>
      </div>
      <SampleContent />
    </PageContainer>
  ),
};

export const ExtraLargeMaxWidth: Story = {
  render: () => (
    <PageContainer maxWidth="xl">
      <div className="bg-muted p-4 rounded mb-4 text-center">
        <p className="text-sm">Extra large max width (max-w-7xl)</p>
      </div>
      <SampleContent />
    </PageContainer>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <PageContainer maxWidth="full">
      <div className="bg-muted p-4 rounded mb-4 text-center">
        <p className="text-sm">Full width (max-w-full)</p>
      </div>
      <SampleContent />
    </PageContainer>
  ),
};

export const CombinedOptions: Story = {
  render: () => (
    <PageContainer padding="lg" spacing="lg" maxWidth="md">
      <div className="bg-muted p-4 rounded mb-4 text-center">
        <p className="text-sm">Large padding + Large spacing + Medium max width</p>
      </div>
      <SampleContent />
    </PageContainer>
  ),
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 px-6">Padding Variations</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground px-6">No Padding</h3>
            <PageContainer padding="none" className="border-2 border-dashed border-muted">
              <div className="bg-primary/10 p-2">Content touches container edges</div>
            </PageContainer>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground px-6">Small Padding</h3>
            <PageContainer padding="sm" className="border-2 border-dashed border-muted">
              <div className="bg-primary/10 p-2">Small padding around content</div>
            </PageContainer>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground px-6">Default Padding</h3>
            <PageContainer className="border-2 border-dashed border-muted">
              <div className="bg-primary/10 p-2">Default padding around content</div>
            </PageContainer>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground px-6">Large Padding</h3>
            <PageContainer padding="lg" className="border-2 border-dashed border-muted">
              <div className="bg-primary/10 p-2">Large padding around content</div>
            </PageContainer>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 px-6">Max Width Variations</h2>
        
        <div className="space-y-4">
          {[
            { width: 'sm', label: 'Small (max-w-2xl)' },
            { width: 'md', label: 'Medium (max-w-4xl)' },
            { width: 'lg', label: 'Large (max-w-6xl)' },
            { width: 'xl', label: 'Extra Large (max-w-7xl)' },
          ].map(({ width, label }) => (
            <div key={width}>
              <h3 className="text-sm font-medium text-muted-foreground px-6">{label}</h3>
              <PageContainer 
                maxWidth={width as any} 
                className="border-2 border-dashed border-muted"
              >
                <div className="bg-primary/10 p-2 text-center">
                  {label} container
                </div>
              </PageContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};