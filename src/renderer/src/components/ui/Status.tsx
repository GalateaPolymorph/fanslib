import { cn } from "@renderer/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const statusVariants = cva("status", {
  variants: {
    variant: {
      success: "status-success",
      error: "status-error",
      warning: "status-warning",
      info: "status-info",
      neutral: "status-neutral",
    },
    size: {
      sm: "status-sm",
      default: "status-md",
      lg: "status-lg",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "default",
  },
});

export type StatusProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof statusVariants>;

export const Status = ({
  className,
  variant = "neutral",
  size = "default",
  children,
  ...props
}: StatusProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className={cn(statusVariants({ variant, size }), className)} {...props}></div>
      {children}
    </div>
  );
};
