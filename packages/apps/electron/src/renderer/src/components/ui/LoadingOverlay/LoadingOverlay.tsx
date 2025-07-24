import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@renderer/lib/utils";

const loadingOverlayVariants = cva("fixed inset-0 z-50 flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-background/80 backdrop-blur-sm",
      dark: "bg-black/50 backdrop-blur-sm",
      light: "bg-white/80 backdrop-blur-sm",
      transparent: "bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const loadingSpinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-6 w-6",
      default: "h-8 w-8",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    },
    color: {
      default: "text-primary",
      muted: "text-muted-foreground",
      white: "text-white",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
});

export type LoadingOverlayProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof loadingOverlayVariants> & {
    spinnerSize?: VariantProps<typeof loadingSpinnerVariants>["size"];
    spinnerColor?: VariantProps<typeof loadingSpinnerVariants>["color"];
    message?: string;
    icon?: React.ReactNode;
    show?: boolean;
  };

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    { className, variant, spinnerSize, spinnerColor, message, icon, show = true, ...props },
    ref
  ) => {
    if (!show) return null;

    return (
      <div ref={ref} className={cn(loadingOverlayVariants({ variant, className }))} {...props}>
        <div className="flex flex-col items-center space-y-4 text-center">
          <div>
            {icon || (
              <Loader2
                className={cn(loadingSpinnerVariants({ size: spinnerSize, color: spinnerColor }))}
              />
            )}
          </div>
          {message && <p className="text-sm text-muted-foreground max-w-sm">{message}</p>}
        </div>
      </div>
    );
  }
);
LoadingOverlay.displayName = "LoadingOverlay";

// Portal version for rendering outside of current component tree
const LoadingOverlayPortal = ({ show = true, ...props }: LoadingOverlayProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <LoadingOverlay {...props} />
    </div>
  );
};

export { LoadingOverlay, LoadingOverlayPortal, loadingOverlayVariants, loadingSpinnerVariants };
