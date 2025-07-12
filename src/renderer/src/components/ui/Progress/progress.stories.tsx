import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Progress } from "./index";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Quarter: Story = {
  args: {
    value: 25,
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
};

export const ThreeQuarters: Story = {
  args: {
    value: 75,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-[400px]">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>75%</span>
      </div>
      <Progress value={75} />
    </div>
  ),
};

export const AnimatedProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="space-y-2 w-[400px]">
        <div className="flex justify-between text-sm">
          <span>Loading...</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    );
  },
};

export const FileUpload: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div>
        <h3 className="text-lg font-medium mb-4">File Upload</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>document.pdf</span>
              <span>Complete</span>
            </div>
            <Progress value={100} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>image.jpg</span>
              <span>67%</span>
            </div>
            <Progress value={67} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>video.mp4</span>
              <span>23%</span>
            </div>
            <Progress value={23} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>archive.zip</span>
              <span>Pending</span>
            </div>
            <Progress value={0} />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SkillProgress: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div>
        <h3 className="text-lg font-medium mb-4">Skills</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>JavaScript</span>
              <span>Expert</span>
            </div>
            <Progress value={95} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>React</span>
              <span>Advanced</span>
            </div>
            <Progress value={85} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>TypeScript</span>
              <span>Intermediate</span>
            </div>
            <Progress value={70} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Node.js</span>
              <span>Beginner</span>
            </div>
            <Progress value={35} />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <span className="text-sm">Success (Green)</span>
        <Progress value={80} className="[&>div]:bg-green-500" />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Warning (Yellow)</span>
        <Progress value={60} className="[&>div]:bg-yellow-500" />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Error (Red)</span>
        <Progress value={40} className="[&>div]:bg-red-500" />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Info (Blue)</span>
        <Progress value={90} className="[&>div]:bg-blue-500" />
      </div>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4 w-[400px]">
      <div className="space-y-2">
        <span className="text-sm">Small</span>
        <Progress value={75} className="h-1" />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Default</span>
        <Progress value={75} />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Large</span>
        <Progress value={75} className="h-4" />
      </div>
      <div className="space-y-2">
        <span className="text-sm">Extra Large</span>
        <Progress value={75} className="h-6" />
      </div>
    </div>
  ),
};
