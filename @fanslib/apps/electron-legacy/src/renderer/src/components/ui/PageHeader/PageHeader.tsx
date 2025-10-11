import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@renderer/lib/utils";

const pageHeaderVariants = cva("flex items-center justify-between", {
  variants: {
    spacing: {
      default: "mb-4",
      sm: "mb-2",
      lg: "mb-6",
      xl: "mb-8",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

const pageTitleVariants = cva("font-bold tracking-tight", {
  variants: {
    size: {
      default: "text-2xl",
      lg: "text-3xl",
      xl: "text-4xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof pageHeaderVariants> & {
    title: string;
    titleSize?: VariantProps<typeof pageTitleVariants>["size"];
    description?: string;
    actions?: React.ReactNode;
  };

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, spacing, title, titleSize, description, actions, ...props }, ref) => (
    <div ref={ref} className={cn(pageHeaderVariants({ spacing, className }))} {...props}>
      <div className="flex flex-col space-y-1">
        <h1 className={cn(pageTitleVariants({ size: titleSize }))}>{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  )
);
PageHeader.displayName = "PageHeader";

export { PageHeader, pageHeaderVariants, pageTitleVariants };
