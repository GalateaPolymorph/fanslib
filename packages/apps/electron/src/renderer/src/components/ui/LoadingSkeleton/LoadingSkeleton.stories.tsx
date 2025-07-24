import type { Meta, StoryObj } from "@storybook/react";
import {
  LoadingSkeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonGrid,
} from "./LoadingSkeleton";

const meta: Meta<typeof LoadingSkeleton> = {
  title: "Layout/LoadingSkeleton",
  component: LoadingSkeleton,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "card", "text", "avatar", "button"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: "200px",
    height: "20px",
  },
};

export const TextVariant: Story = {
  args: {
    variant: "text",
    width: "300px",
  },
};

export const AvatarVariant: Story = {
  args: {
    variant: "avatar",
    className: "w-10 h-10",
  },
};

export const ButtonVariant: Story = {
  args: {
    variant: "button",
    width: "120px",
    height: "36px",
  },
};

export const SkeletonTextExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Single Line</h3>
        <SkeletonText lines={1} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Paragraph (3 lines)</h3>
        <SkeletonText lines={3} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Long Content (5 lines)</h3>
        <SkeletonText lines={5} />
      </div>
    </div>
  ),
};

export const SkeletonCardExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Single Card</h3>
        <div className="max-w-sm">
          <SkeletonCard />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Multiple Cards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  ),
};

export const SkeletonAvatarExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Avatar Sizes</h3>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <SkeletonAvatar size="sm" />
            <p className="text-xs mt-1">Small</p>
          </div>
          <div className="text-center">
            <SkeletonAvatar size="default" />
            <p className="text-xs mt-1">Default</p>
          </div>
          <div className="text-center">
            <SkeletonAvatar size="lg" />
            <p className="text-xs mt-1">Large</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">User List</h3>
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <SkeletonAvatar />
              <div className="flex-1">
                <SkeletonText lines={1} className="max-w-[150px]" />
                <SkeletonText lines={1} className="max-w-[200px] mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const SkeletonGridExample: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">2 Columns</h3>
        <SkeletonGrid items={4} columns={2} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">3 Columns (Default)</h3>
        <SkeletonGrid items={6} columns={3} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">4 Columns</h3>
        <SkeletonGrid items={8} columns={4} />
      </div>
    </div>
  ),
};

export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Article List</h3>
        <div className="space-y-4 max-w-2xl">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <SkeletonAvatar />
                <div className="flex-1 space-y-2">
                  <LoadingSkeleton variant="text" width="60%" size="lg" />
                  <SkeletonText lines={2} />
                  <div className="flex space-x-4">
                    <LoadingSkeleton variant="button" width="80px" height="24px" />
                    <LoadingSkeleton variant="button" width="60px" height="24px" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Dashboard Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <LoadingSkeleton variant="text" width="100px" size="lg" />
                <LoadingSkeleton variant="avatar" className="w-8 h-8" />
              </div>
              <LoadingSkeleton variant="text" width="60px" size="xl" className="mb-2" />
              <SkeletonText lines={1} className="max-w-[80%]" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Media Gallery</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="space-y-2">
              <LoadingSkeleton variant="card" className="aspect-square rounded-lg" />
              <SkeletonText lines={1} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Table Rows</h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 border rounded">
              <SkeletonAvatar size="sm" />
              <LoadingSkeleton width="120px" />
              <LoadingSkeleton width="80px" />
              <LoadingSkeleton width="60px" />
              <LoadingSkeleton variant="button" width="70px" height="32px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Skeletons</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="w-20 text-sm">Default:</span>
            <LoadingSkeleton width="200px" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="w-20 text-sm">Text:</span>
            <LoadingSkeleton variant="text" width="250px" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="w-20 text-sm">Avatar:</span>
            <LoadingSkeleton variant="avatar" className="w-10 h-10" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="w-20 text-sm">Button:</span>
            <LoadingSkeleton variant="button" width="100px" height="36px" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sizes</h3>
        <div className="space-y-2">
          <LoadingSkeleton size="sm" width="200px" />
          <LoadingSkeleton size="default" width="200px" />
          <LoadingSkeleton size="lg" width="200px" />
          <LoadingSkeleton size="xl" width="200px" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Preset Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Text Lines</h4>
            <SkeletonText lines={3} />
          </div>
          <div>
            <h4 className="font-medium mb-2">Card</h4>
            <SkeletonCard />
          </div>
        </div>
      </div>
    </div>
  ),
};
