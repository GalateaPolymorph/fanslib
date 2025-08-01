import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@renderer/lib/utils";

const pageContainerVariants = cva("container mx-auto", {
  variants: {
    padding: {
      default: "p-6",
      sm: "p-4",
      lg: "p-8",
      none: "",
    },
    spacing: {
      default: "space-y-6",
      sm: "space-y-3",
      lg: "space-y-8",
      none: "",
    },
    maxWidth: {
      default: "",
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-[1800px]",
      full: "max-w-full",
    },
  },
  defaultVariants: {
    padding: "default",
    spacing: "default",
    maxWidth: "default",
  },
});

export type PageContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof pageContainerVariants>;

const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, padding, spacing, maxWidth, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(pageContainerVariants({ padding, spacing, maxWidth, className }))}
      {...props}
    />
  )
);
PageContainer.displayName = "PageContainer";

export { PageContainer, pageContainerVariants };
