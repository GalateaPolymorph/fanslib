import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@renderer/lib/utils";

const emptyStateVariants = cva("text-center text-muted-foreground", {
  variants: {
    padding: {
      default: "py-8",
      sm: "py-4",
      lg: "py-12",
      xl: "py-16",
    },
    size: {
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    padding: "default",
    size: "default",
  },
});

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof emptyStateVariants> & {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    action?: React.ReactNode;
  };

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, padding, size, icon, title, description, action, children, ...props }, ref) => (
    <div ref={ref} className={cn(emptyStateVariants({ padding, size, className }))} {...props}>
      <div className="flex flex-col items-center space-y-3">
        {icon && <div className="text-muted-foreground/50">{icon}</div>}
        {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
        {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
        {children}
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  )
);
EmptyState.displayName = "EmptyState";

export { EmptyState, emptyStateVariants };
