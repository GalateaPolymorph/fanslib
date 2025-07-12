import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Slider } from "./index";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    min: {
      control: { type: "number" },
    },
    max: {
      control: { type: "number" },
    },
    step: {
      control: { type: "number" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState([50]);

    return (
      <div className="w-[300px]">
        <Slider value={value} onValueChange={setValue} min={0} max={100} step={1} />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState([25]);

    return (
      <div className="w-[300px] space-y-2">
        <div className="flex justify-between text-sm">
          <span>Volume</span>
          <span>{value[0]}%</span>
        </div>
        <Slider value={value} onValueChange={setValue} min={0} max={100} step={1} />
      </div>
    );
  },
};

export const CustomRange: Story = {
  render: () => {
    const [value, setValue] = useState([500]);

    return (
      <div className="w-[300px] space-y-2">
        <div className="flex justify-between text-sm">
          <span>Price Range</span>
          <span>${value[0]}</span>
        </div>
        <Slider value={value} onValueChange={setValue} min={0} max={1000} step={10} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>$1000</span>
        </div>
      </div>
    );
  },
};

export const WithSteps: Story = {
  render: () => {
    const [value, setValue] = useState([2]);

    return (
      <div className="w-[300px] space-y-2">
        <div className="flex justify-between text-sm">
          <span>Quality</span>
          <span>{["Low", "Medium", "High", "Ultra"][value[0]]}</span>
        </div>
        <Slider value={value} onValueChange={setValue} min={0} max={3} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>Ultra</span>
        </div>
      </div>
    );
  },
};

export const DecimalSteps: Story = {
  render: () => {
    const [value, setValue] = useState([2.5]);

    return (
      <div className="w-[300px] space-y-2">
        <div className="flex justify-between text-sm">
          <span>Rating</span>
          <span>{value[0].toFixed(1)} stars</span>
        </div>
        <Slider value={value} onValueChange={setValue} min={0} max={5} step={0.1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>5</span>
        </div>
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [volume, setVolume] = useState([75]);
    const [brightness, setBrightness] = useState([50]);
    const [temperature, setTemperature] = useState([20]);

    return (
      <div className="w-[350px] space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Volume</span>
                <span>{volume[0]}%</span>
              </div>
              <Slider value={volume} onValueChange={setVolume} min={0} max={100} step={1} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Brightness</span>
                <span>{brightness[0]}%</span>
              </div>
              <Slider value={brightness} onValueChange={setBrightness} min={0} max={100} step={1} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Temperature</span>
                <span>{temperature[0]}°C</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={10}
                max={30}
                step={0.5}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const PriceFilter: Story = {
  render: () => {
    const [price, setPrice] = useState([250]);

    return (
      <div className="w-[300px] space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Price Filter</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Maximum Price</span>
              <span>${price[0]}</span>
            </div>
            <Slider value={price} onValueChange={setPrice} min={0} max={500} step={5} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Free</span>
              <span>$500+</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const ProgressIndicator: Story = {
  render: () => {
    const [progress, setProgress] = useState([0]);

    const startProgress = () => {
      setProgress([0]);
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev[0] + 1;
          if (newValue >= 100) {
            clearInterval(interval);
            return [100];
          }
          return [newValue];
        });
      }, 100);
    };

    return (
      <div className="w-[300px] space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress[0]}%</span>
          </div>
          <Slider value={progress} onValueChange={setProgress} min={0} max={100} step={1} />
        </div>
        <button
          onClick={startProgress}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
        >
          Start Progress
        </button>
      </div>
    );
  },
};

export const DifferentWidths: Story = {
  render: () => {
    const [value1, setValue1] = useState([50]);
    const [value2, setValue2] = useState([75]);
    const [value3, setValue3] = useState([25]);

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-sm">Small (200px)</span>
          <div className="w-[200px]">
            <Slider value={value1} onValueChange={setValue1} min={0} max={100} step={1} />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm">Medium (300px)</span>
          <div className="w-[300px]">
            <Slider value={value2} onValueChange={setValue2} min={0} max={100} step={1} />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm">Large (400px)</span>
          <div className="w-[400px]">
            <Slider value={value3} onValueChange={setValue3} min={0} max={100} step={1} />
          </div>
        </div>
      </div>
    );
  },
};
