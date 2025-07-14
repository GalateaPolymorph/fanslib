import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@renderer/lib/utils";

const formActionsVariants = cva(
  "flex",
  {
    variants: {
      justify: {
        start: "justify-start",
        end: "justify-end",
        center: "justify-center",
        between: "justify-between",
      },
      direction: {
        row: "flex-row",
        col: "flex-col",
      },
      spacing: {
        none: "",
        sm: "space-x-2",
        default: "space-x-3",
        lg: "space-x-4",
      },
      responsive: {
        true: "flex-col sm:flex-row sm:space-x-3 sm:space-y-0 space-y-2",
        false: "",
      },
    },
    defaultVariants: {
      justify: "end",
      direction: "row", 
      spacing: "default",
      responsive: false,
    },
    compoundVariants: [
      {
        direction: "col",
        spacing: "sm",
        class: "space-y-2 space-x-0",
      },
      {
        direction: "col", 
        spacing: "default",
        class: "space-y-3 space-x-0",
      },
      {
        direction: "col",
        spacing: "lg", 
        class: "space-y-4 space-x-0",
      },
    ],
  }
);

export type FormActionsProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof formActionsVariants>;

const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, justify, direction, spacing, responsive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(formActionsVariants({ justify, direction, spacing, responsive, className }))}
      {...props}
    />
  )
);
FormActions.displayName = "FormActions";

export { FormActions, formActionsVariants };