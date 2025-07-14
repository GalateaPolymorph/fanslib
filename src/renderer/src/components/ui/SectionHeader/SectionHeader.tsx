import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@renderer/lib/utils";

const sectionHeaderVariants = cva(
  "flex items-center justify-between",
  {
    variants: {
      spacing: {
        default: "mb-4",
        sm: "mb-2", 
        lg: "mb-6",
        none: "",
      },
    },
    defaultVariants: {
      spacing: "default",
    },
  }
);

const sectionTitleVariants = cva(
  "font-semibold tracking-tight",
  {
    variants: {
      size: {
        default: "text-lg",
        sm: "text-base",
        lg: "text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type SectionHeaderProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof sectionHeaderVariants> & {
    title: string;
    titleSize?: VariantProps<typeof sectionTitleVariants>["size"];
    description?: string;
    actions?: React.ReactNode;
  };

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, spacing, title, titleSize, description, actions, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(sectionHeaderVariants({ spacing, className }))}
      {...props}
    >
      <div className="flex flex-col space-y-1">
        <h2 className={cn(sectionTitleVariants({ size: titleSize }))}>
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

export { SectionHeader, sectionHeaderVariants, sectionTitleVariants };