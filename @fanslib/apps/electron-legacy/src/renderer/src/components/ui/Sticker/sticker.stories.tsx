import type { Meta, StoryObj } from "@storybook/react";
import { Badge, Clock, Download, Eye, Heart, Star, User } from "lucide-react";
import { Sticker } from "./index";

const meta: Meta<typeof Sticker> = {
  title: "UI/Sticker",
  component: Sticker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "5",
  },
};

export const WithText: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Sticker>NEW</Sticker>
      <Sticker>HOT</Sticker>
      <Sticker>SALE</Sticker>
      <Sticker>99+</Sticker>
    </div>
  ),
};

export const WithNumbers: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Sticker>1</Sticker>
      <Sticker>12</Sticker>
      <Sticker>123</Sticker>
      <Sticker>999+</Sticker>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Sticker>
        <Star className="h-3 w-3" />
      </Sticker>
      <Sticker>
        <Heart className="h-3 w-3" />
      </Sticker>
      <Sticker>
        <Eye className="h-3 w-3" />
      </Sticker>
      <Sticker>
        <Download className="h-3 w-3" />
      </Sticker>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Sticker className="bg-red-100 text-red-800 border-red-200">3</Sticker>
      <Sticker className="bg-blue-100 text-blue-800 border-blue-200">12</Sticker>
      <Sticker className="bg-green-100 text-green-800 border-green-200">5</Sticker>
      <Sticker className="bg-yellow-100 text-yellow-800 border-yellow-200">NEW</Sticker>
      <Sticker className="bg-purple-100 text-purple-800 border-purple-200">
        <Star className="h-3 w-3" />
      </Sticker>
    </div>
  ),
};

export const Badges: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Notification Badges</h3>
        <div className="flex gap-6 items-center">
          <div className="relative">
            <button className="p-2 bg-gray-100 rounded-lg">
              <Badge className="h-5 w-5" />
            </button>
            <Sticker className="absolute -top-1 -right-1 bg-red-500 text-white border-red-500">
              3
            </Sticker>
          </div>

          <div className="relative">
            <button className="p-2 bg-gray-100 rounded-lg">
              <Heart className="h-5 w-5" />
            </button>
            <Sticker className="absolute -top-1 -right-1 bg-red-500 text-white border-red-500">
              12
            </Sticker>
          </div>

          <div className="relative">
            <button className="p-2 bg-gray-100 rounded-lg">
              <User className="h-5 w-5" />
            </button>
            <Sticker className="absolute -top-1 -right-1 bg-green-500 text-white border-green-500">
              5
            </Sticker>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Status Indicators</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              📄
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Document.pdf</p>
              <p className="text-xs text-gray-500">2.4 MB</p>
            </div>
            <Sticker className="bg-blue-100 text-blue-800 border-blue-200">PDF</Sticker>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              🎥
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Video.mp4</p>
              <p className="text-xs text-gray-500">15.7 MB</p>
            </div>
            <Sticker className="bg-purple-100 text-purple-800 border-purple-200">4K</Sticker>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              🖼️
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Image.jpg</p>
              <p className="text-xs text-gray-500">3.2 MB</p>
            </div>
            <Sticker className="bg-green-100 text-green-800 border-green-200">HD</Sticker>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ContentStats: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Content Performance</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Views</h4>
            <Sticker className="bg-blue-100 text-blue-800 border-blue-200">
              <Eye className="h-3 w-3 mr-1" />
              1.2K
            </Sticker>
          </div>
          <p className="text-xs text-gray-500">Total content views</p>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Likes</h4>
            <Sticker className="bg-red-100 text-red-800 border-red-200">
              <Heart className="h-3 w-3 mr-1" />
              456
            </Sticker>
          </div>
          <p className="text-xs text-gray-500">Total likes received</p>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Downloads</h4>
            <Sticker className="bg-green-100 text-green-800 border-green-200">
              <Download className="h-3 w-3 mr-1" />
              789
            </Sticker>
          </div>
          <p className="text-xs text-gray-500">Content downloads</p>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Pending</h4>
            <Sticker className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Clock className="h-3 w-3 mr-1" />
              23
            </Sticker>
          </div>
          <p className="text-xs text-gray-500">Awaiting approval</p>
        </div>
      </div>
    </div>
  ),
};

export const TagSystem: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Content Tags</h3>
      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-2">Popular Tags</h4>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">#fitness</span>
              <Sticker className="bg-blue-100 text-blue-800 border-blue-200">23</Sticker>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">#lifestyle</span>
              <Sticker className="bg-green-100 text-green-800 border-green-200">18</Sticker>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">#tutorial</span>
              <Sticker className="bg-purple-100 text-purple-800 border-purple-200">12</Sticker>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-gray-600 mb-2">Content Types</h4>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Videos</span>
              <Sticker className="bg-red-100 text-red-800 border-red-200">156</Sticker>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Photos</span>
              <Sticker className="bg-yellow-100 text-yellow-800 border-yellow-200">234</Sticker>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Stories</span>
              <Sticker className="bg-cyan-100 text-cyan-800 border-cyan-200">89</Sticker>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Sticker className="min-w-3 h-3 text-xs">1</Sticker>
      <Sticker className="min-w-4 h-4 text-xs">5</Sticker>
      <Sticker className="min-w-5 h-5 text-sm">12</Sticker>
      <Sticker className="min-w-6 h-6 text-sm">99+</Sticker>
      <Sticker className="min-w-8 h-8 text-base">NEW</Sticker>
    </div>
  ),
};
