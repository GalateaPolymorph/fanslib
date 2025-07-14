import type { Meta, StoryObj } from '@storybook/react';
import { GridContainer } from './GridContainer';

const meta: Meta<typeof GridContainer> = {
  title: 'Layout/GridContainer',
  component: GridContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6, 'auto'],
    },
    gap: {
      control: { type: 'select' },
      options: ['none', 'sm', 'default', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample card component for demonstration
const SampleCard = ({ title }: { title: string }) => (
  <div className="p-4 border rounded-lg bg-card">
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">
      Sample content for demonstration purposes.
    </p>
  </div>
);

export const ThreeColumns: Story = {
  args: {
    columns: 3,
  },
  render: (args) => (
    <GridContainer {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <SampleCard key={i} title={`Card ${i + 1}`} />
      ))}
    </GridContainer>
  ),
};

export const AutoFit: Story = {
  args: {
    columns: 'auto',
  },
  render: (args) => (
    <GridContainer {...args}>
      {Array.from({ length: 8 }, (_, i) => (
        <SampleCard key={i} title={`Auto Card ${i + 1}`} />
      ))}
    </GridContainer>
  ),
};

export const TwoColumns: Story = {
  args: {
    columns: 2,
    gap: 'lg',
  },
  render: (args) => (
    <GridContainer {...args}>
      {Array.from({ length: 4 }, (_, i) => (
        <SampleCard key={i} title={`Two Col ${i + 1}`} />
      ))}
    </GridContainer>
  ),
};

export const FourColumns: Story = {
  args: {
    columns: 4,
    gap: 'sm',
  },
  render: (args) => (
    <GridContainer {...args}>
      {Array.from({ length: 8 }, (_, i) => (
        <SampleCard key={i} title={`Four Col ${i + 1}`} />
      ))}
    </GridContainer>
  ),
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">1 Column</h3>
        <GridContainer columns={1}>
          {Array.from({ length: 2 }, (_, i) => (
            <SampleCard key={i} title={`Single ${i + 1}`} />
          ))}
        </GridContainer>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">3 Columns (Default)</h3>
        <GridContainer columns={3}>
          {Array.from({ length: 6 }, (_, i) => (
            <SampleCard key={i} title={`Triple ${i + 1}`} />
          ))}
        </GridContainer>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Auto-fit (250px min)</h3>
        <GridContainer columns="auto">
          {Array.from({ length: 5 }, (_, i) => (
            <SampleCard key={i} title={`Auto ${i + 1}`} />
          ))}
        </GridContainer>
      </div>
    </div>
  ),
};