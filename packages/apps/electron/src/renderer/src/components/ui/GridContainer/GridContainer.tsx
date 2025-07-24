import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@renderer/lib/utils";

const gridContainerVariants = cva("grid gap-4", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
      auto: "grid-cols-[repeat(auto-fill,minmax(250px,1fr))]",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2",
      default: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    responsive: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    columns: 3,
    gap: "default",
    responsive: true,
  },
});

export type GridContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof gridContainerVariants>;

const GridContainer = React.forwardRef<HTMLDivElement, GridContainerProps>(
  ({ className, columns, gap, responsive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gridContainerVariants({ columns, gap, responsive, className }))}
      {...props}
    />
  )
);
GridContainer.displayName = "GridContainer";

export { GridContainer, gridContainerVariants };
