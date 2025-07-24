import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Upload, Download, RotateCw, Database } from "lucide-react";
import { Button } from "../Button";
import { LoadingOverlay, LoadingOverlayPortal } from "./LoadingOverlay";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Layout/LoadingOverlay",
  component: LoadingOverlay,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "dark", "light", "transparent"],
    },
    spinnerSize: {
      control: { type: "select" },
      options: ["sm", "default", "lg", "xl"],
    },
    spinnerColor: {
      control: { type: "select" },
      options: ["default", "muted", "white"],
    },
    show: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const OverlayDemo = ({
  children,
  buttonText = "Show Loading",
  duration = 3000,
  ...overlayProps
}: any) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), duration);
  };

  return (
    <div className="relative min-h-[400px] p-8 border rounded-lg">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sample Content</h3>
        <p>This content will be overlaid when loading is active.</p>
        <Button onClick={handleClick}>{buttonText}</Button>
        {children}
      </div>

      <LoadingOverlay show={loading} {...overlayProps} />
    </div>
  );
};

export const Default: Story = {
  render: () => <OverlayDemo message="Loading..." />,
};

export const WithCustomMessage: Story = {
  render: () => (
    <OverlayDemo message="Processing your request, please wait..." buttonText="Start Processing" />
  ),
};

export const DarkVariant: Story = {
  render: () => (
    <OverlayDemo
      variant="dark"
      spinnerColor="white"
      message="Uploading files..."
      buttonText="Upload Files"
    />
  ),
};

export const LightVariant: Story = {
  render: () => (
    <div className="bg-gray-800 rounded-lg">
      <OverlayDemo variant="light" message="Syncing data..." buttonText="Sync Data" />
    </div>
  ),
};

export const TransparentVariant: Story = {
  render: () => <OverlayDemo variant="transparent" message="Saving changes..." buttonText="Save" />,
};

export const CustomIcon: Story = {
  render: () => (
    <OverlayDemo
      icon={<Upload className="h-8 w-8 animate-bounce" />}
      message="Uploading media files..."
      buttonText="Upload"
    />
  ),
};

export const LargeSpinner: Story = {
  render: () => (
    <OverlayDemo
      spinnerSize="xl"
      message="Processing large dataset..."
      buttonText="Process Data"
      duration={5000}
    />
  ),
};

export const SmallSpinner: Story = {
  render: () => (
    <OverlayDemo spinnerSize="sm" message="Quick save..." buttonText="Quick Save" duration={1000} />
  ),
};

export const NoMessage: Story = {
  render: () => <OverlayDemo spinnerSize="lg" buttonText="Silent Loading" />,
};

export const PortalExample: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 3000);
    };

    return (
      <div className="p-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Portal Loading Overlay</h3>
          <p>This overlay will cover the entire viewport when shown.</p>
          <Button onClick={handleClick}>Show Full Screen Loading</Button>
        </div>

        <LoadingOverlayPortal show={loading} message="Loading application..." variant="default" />
      </div>
    );
  },
};

export const MultipleStates: Story = {
  render: () => {
    const [activeState, setActiveState] = useState<string | null>(null);

    const states = [
      {
        key: "uploading",
        icon: <Upload className="h-8 w-8 animate-bounce" />,
        message: "Uploading files...",
        variant: "default" as const,
      },
      {
        key: "downloading",
        icon: <Download className="h-8 w-8 animate-bounce" />,
        message: "Downloading data...",
        variant: "dark" as const,
        spinnerColor: "white" as const,
      },
      {
        key: "syncing",
        icon: <RotateCw className="h-8 w-8 animate-spin" />,
        message: "Syncing with server...",
        variant: "light" as const,
      },
      {
        key: "saving",
        icon: <Database className="h-8 w-8 animate-pulse" />,
        message: "Saving to database...",
        variant: "transparent" as const,
      },
    ];

    const startState = (stateKey: string) => {
      setActiveState(stateKey);
      setTimeout(() => setActiveState(null), 3000);
    };

    return (
      <div className="relative min-h-[500px] p-8 border rounded-lg">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Multiple Loading States</h3>
          <p>Try different loading states with various icons and styles.</p>

          <div className="grid grid-cols-2 gap-2">
            {states.map((state) => (
              <Button
                key={state.key}
                variant="outline"
                onClick={() => startState(state.key)}
                disabled={activeState !== null}
              >
                {state.message.split(" ")[0]}
              </Button>
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted rounded">
            <p className="text-sm text-muted-foreground">
              Sample content that gets overlaid during loading states.
            </p>
          </div>
        </div>

        {states.map((state) => (
          <LoadingOverlay
            key={state.key}
            show={activeState === state.key}
            icon={state.icon}
            message={state.message}
            variant={state.variant}
            spinnerColor={state.spinnerColor}
          />
        ))}
      </div>
    );
  },
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Default Variant</h3>
          <OverlayDemo message="Default loading overlay" buttonText="Default" duration={2000} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Dark Variant</h3>
          <OverlayDemo
            variant="dark"
            spinnerColor="white"
            message="Dark loading overlay"
            buttonText="Dark"
            duration={2000}
          />
        </div>

        <div className="bg-gray-800 rounded-lg p-1">
          <h3 className="text-lg font-semibold mb-4 text-white p-3 pb-0">Light Variant</h3>
          <OverlayDemo
            variant="light"
            message="Light loading overlay"
            buttonText="Light"
            duration={2000}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Transparent Variant</h3>
          <OverlayDemo
            variant="transparent"
            message="Transparent overlay"
            buttonText="Transparent"
            duration={2000}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Spinner Sizes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["sm", "default", "lg", "xl"].map((size) => (
            <OverlayDemo
              key={size}
              spinnerSize={size as any}
              message={`${size} spinner`}
              buttonText={size.toUpperCase()}
              duration={1500}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};
