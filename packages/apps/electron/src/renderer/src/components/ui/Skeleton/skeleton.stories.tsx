import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./index";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton className="w-[200px] h-[20px]" />,
};

export const Rectangle: Story = {
  render: () => <Skeleton className="w-[300px] h-[100px]" />,
};

export const Circle: Story = {
  render: () => <Skeleton className="w-[50px] h-[50px] rounded-full" />,
};

export const Avatar: Story = {
  render: () => <Skeleton className="w-[40px] h-[40px] rounded-full" />,
};

export const Button: Story = {
  render: () => <Skeleton className="w-[100px] h-[40px] rounded-md" />,
};

export const Text: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div className="flex items-center space-x-4 p-4 border rounded-lg w-[350px]">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  ),
};

export const ArticleCard: Story = {
  render: () => (
    <div className="space-y-4 w-[400px] p-4 border rounded-lg">
      <Skeleton className="h-[200px] w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-[80%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[70%]" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </div>
    </div>
  ),
};

export const ProductGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[400px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-[120px] w-full rounded-md" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      ))}
    </div>
  ),
};

export const TableRows: Story = {
  render: () => (
    <div className="space-y-3 w-[500px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-3 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
          <Skeleton className="h-3 w-[60px]" />
          <Skeleton className="h-6 w-[80px] rounded-md" />
        </div>
      ))}
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div>
        <h3 className="text-lg font-medium mb-4">Loading States</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Button Loading</h4>
            <Skeleton className="h-10 w-[120px] rounded-md" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Input Loading</h4>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Avatar Loading</h4>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Text Loading</h4>
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
