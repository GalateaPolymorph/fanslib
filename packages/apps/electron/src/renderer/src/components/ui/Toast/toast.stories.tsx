import type { Meta, StoryObj } from "@storybook/react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastHeadline,
  ToastProvider,
  ToastViewport,
} from "./index";

const meta: Meta<typeof Toast> = {
  title: "UI/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive", "success"],
      description: "Toast variant",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button onClick={() => setOpen(true)}>Show Toast</Button>

        <Toast open={open} onOpenChange={setOpen}>
          <div className="grid gap-1">
            <ToastHeadline>Notification</ToastHeadline>
            <ToastDescription>Your message has been sent successfully.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>

        <ToastViewport />
      </ToastProvider>
    );
  },
};

export const Success: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button onClick={() => setOpen(true)}>Show Success</Button>

        <Toast open={open} onOpenChange={setOpen} variant="success">
          <div className="flex">
            <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
            <div className="grid gap-1">
              <ToastHeadline>Success</ToastHeadline>
              <ToastDescription>Content uploaded successfully!</ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <ToastViewport />
      </ToastProvider>
    );
  },
};

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Show Error
        </Button>

        <Toast open={open} onOpenChange={setOpen} variant="destructive">
          <div className="flex">
            <XCircle className="h-4 w-4 mr-2 mt-0.5" />
            <div className="grid gap-1">
              <ToastHeadline>Error</ToastHeadline>
              <ToastDescription>Failed to upload content. Please try again.</ToastDescription>
            </div>
          </div>
          <ToastClose />
        </Toast>

        <ToastViewport />
      </ToastProvider>
    );
  },
};

export const WithAction: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button onClick={() => setOpen(true)}>Show with Action</Button>

        <Toast open={open} onOpenChange={setOpen}>
          <div className="grid gap-1">
            <ToastHeadline>Content Deleted</ToastHeadline>
            <ToastDescription>Your content has been moved to trash.</ToastDescription>
          </div>
          <ToastAction altText="Undo deletion">Undo</ToastAction>
          <ToastClose />
        </Toast>

        <ToastViewport />
      </ToastProvider>
    );
  },
};

export const ContentNotifications: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      { id: string; type: string; title: string; message: string; action?: string }[]
    >([]);

    const addToast = (type: string, title: string, message: string, action?: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message, action }]);
    };

    const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
      <ToastProvider>
        <div className="space-y-2">
          <h3 className="text-sm font-medium mb-4">Content Management Notifications</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() =>
                addToast("success", "Upload Complete", "photo_001.jpg uploaded successfully")
              }
              variant="outline"
            >
              Upload Success
            </Button>
            <Button
              onClick={() => addToast("error", "Upload Failed", "video_002.mp4 failed to upload")}
              variant="outline"
            >
              Upload Error
            </Button>
            <Button
              onClick={() => addToast("info", "Processing", "Content is being processed...")}
              variant="outline"
            >
              Processing
            </Button>
            <Button
              onClick={() => addToast("delete", "Content Deleted", "Item moved to trash", "Undo")}
              variant="outline"
            >
              Delete with Undo
            </Button>
          </div>
        </div>

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => removeToast(toast.id)}
            variant={
              toast.type === "success"
                ? "success"
                : toast.type === "error"
                  ? "destructive"
                  : "default"
            }
          >
            <div className="flex">
              {toast.type === "success" && <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />}
              {toast.type === "error" && <XCircle className="h-4 w-4 mr-2 mt-0.5" />}
              {toast.type === "info" && <Info className="h-4 w-4 mr-2 mt-0.5" />}
              {toast.type === "delete" && <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />}
              <div className="grid gap-1">
                <ToastHeadline>{toast.title}</ToastHeadline>
                <ToastDescription>{toast.message}</ToastDescription>
              </div>
            </div>
            {toast.action && <ToastAction altText={toast.action}>{toast.action}</ToastAction>}
            <ToastClose />
          </Toast>
        ))}

        <ToastViewport />
      </ToastProvider>
    );
  },
};

export const ScheduledContent: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      { id: string; title: string; message: string; time: string }[]
    >([]);

    const scheduleToast = (title: string, message: string, delay: number) => {
      setTimeout(() => {
        const id = Math.random().toString(36).substr(2, 9);
        const time = new Date().toLocaleTimeString();
        setToasts((prev) => [...prev, { id, title, message, time }]);
      }, delay);
    };

    const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
      <ToastProvider>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Scheduled Content Notifications</h3>
          <Button
            onClick={() => {
              scheduleToast("Post Scheduled", "Your content will be posted at 9:00 AM", 1000);
              scheduleToast("Reminder", "Don't forget to review tomorrow's content", 3000);
              scheduleToast("Analytics Ready", "Weekly performance report is available", 5000);
            }}
          >
            Simulate Scheduled Notifications
          </Button>
        </div>

        {toasts.map((toast) => (
          <Toast key={toast.id} open={true} onOpenChange={() => removeToast(toast.id)}>
            <div className="grid gap-1">
              <ToastHeadline className="flex items-center justify-between">
                {toast.title}
                <span className="text-xs text-muted-foreground">{toast.time}</span>
              </ToastHeadline>
              <ToastDescription>{toast.message}</ToastDescription>
            </div>
            <ToastClose />
          </Toast>
        ))}

        <ToastViewport />
      </ToastProvider>
    );
  },
};

export const ProgressToasts: Story = {
  render: () => {
    const [toasts, setToasts] = useState<{ id: string; progress: number; filename: string }[]>([]);

    const startUpload = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const filename = `content_${Date.now()}.jpg`;
      setToasts((prev) => [...prev, { id, progress: 0, filename }]);

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
          }, 2000);
        }
        setToasts((prev) =>
          prev.map((toast) => (toast.id === id ? { ...toast, progress } : toast))
        );
      }, 500);
    };

    return (
      <ToastProvider>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Upload Progress</h3>
          <Button onClick={startUpload}>Start Upload</Button>
        </div>

        {toasts.map((toast) => (
          <Toast key={toast.id} open={true} onOpenChange={() => {}}>
            <div className="grid gap-2">
              <ToastHeadline>Uploading {toast.filename}</ToastHeadline>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{Math.round(toast.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${toast.progress}%` }}
                  />
                </div>
              </div>
            </div>
            {toast.progress < 100 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              >
                Cancel
              </Button>
            )}
          </Toast>
        ))}

        <ToastViewport />
      </ToastProvider>
    );
  },
};

export const MultipleToasts: Story = {
  render: () => {
    const [toasts, setToasts] = useState<
      { id: string; variant: string; title: string; message: string }[]
    >([]);

    const addMultipleToasts = () => {
      const newToasts = [
        {
          id: "1",
          variant: "success",
          title: "Upload Complete",
          message: "photo_001.jpg uploaded",
        },
        { id: "2", variant: "default", title: "Processing", message: "Generating thumbnails..." },
        { id: "3", variant: "destructive", title: "Error", message: "Failed to sync with cloud" },
        {
          id: "4",
          variant: "success",
          title: "Backup Complete",
          message: "Library backed up successfully",
        },
      ];
      setToasts(newToasts);
    };

    const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
      <ToastProvider>
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Multiple Notifications</h3>
          <Button onClick={addMultipleToasts}>Show Multiple Toasts</Button>
          <Button variant="outline" onClick={() => setToasts([])}>
            Clear All
          </Button>
        </div>

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onOpenChange={() => removeToast(toast.id)}
            variant={toast.variant as any}
          >
            <div className="flex">
              {toast.variant === "success" && <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />}
              {toast.variant === "destructive" && <XCircle className="h-4 w-4 mr-2 mt-0.5" />}
              {toast.variant === "default" && <Info className="h-4 w-4 mr-2 mt-0.5" />}
              <div className="grid gap-1">
                <ToastHeadline>{toast.title}</ToastHeadline>
                <ToastDescription>{toast.message}</ToastDescription>
              </div>
            </div>
            <ToastClose />
          </Toast>
        ))}

        <ToastViewport />
      </ToastProvider>
    );
  },
};
