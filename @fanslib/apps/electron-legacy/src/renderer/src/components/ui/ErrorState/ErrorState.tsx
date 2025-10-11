import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import * as React from "react";

import { Button } from "@renderer/components/ui/Button";
import { cn } from "@renderer/lib/utils";

const errorStateVariants = cva("text-center", {
  variants: {
    padding: {
      default: "py-8",
      sm: "py-4",
      lg: "py-12",
      xl: "py-16",
    },
    variant: {
      default: "text-destructive",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    padding: "default",
    variant: "default",
  },
});

export type ErrorStateProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof errorStateVariants> & {
    title?: string;
    description?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
    showRetry?: boolean;
    onRetry?: () => void;
    retryText?: string;
  };

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      padding,
      variant,
      title = "Something went wrong",
      description,
      action,
      icon,
      showRetry = false,
      onRetry,
      retryText = "Try again",
      children,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn(errorStateVariants({ padding, variant, className }))} {...props}>
      <div className="flex flex-col items-center space-y-3">
        <div className="text-destructive/50">{icon || <AlertCircle className="h-12 w-12" />}</div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
        {children}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {showRetry && onRetry && (
            <Button variant="outline" onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {retryText}
            </Button>
          )}
          {action}
        </div>
      </div>
    </div>
  )
);
ErrorState.displayName = "ErrorState";

// Preset error components for common scenarios
const NetworkErrorState = ({ onRetry, ...props }: Omit<ErrorStateProps, "icon" | "title">) => (
  <ErrorState
    icon={<WifiOff className="h-12 w-12" />}
    title="Connection error"
    description="Please check your internet connection and try again."
    showRetry
    onRetry={onRetry}
    {...props}
  />
);

const GenericErrorState = ({ onRetry, ...props }: Omit<ErrorStateProps, "title">) => (
  <ErrorState
    title="Something went wrong"
    description="An unexpected error occurred. Please try again."
    showRetry
    onRetry={onRetry}
    {...props}
  />
);

const NotFoundErrorState = ({
  resourceName = "resource",
  ...props
}: { resourceName?: string } & Omit<ErrorStateProps, "title" | "showRetry">) => (
  <ErrorState
    title={`${resourceName} not found`}
    description={`The ${resourceName.toLowerCase()} you're looking for doesn't exist or has been removed.`}
    variant="muted"
    {...props}
  />
);

export { ErrorState, errorStateVariants, NetworkErrorState, GenericErrorState, NotFoundErrorState };
