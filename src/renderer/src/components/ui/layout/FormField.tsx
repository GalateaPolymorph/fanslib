import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Label } from "@renderer/components/ui/Label";
import { cn } from "@renderer/lib/utils";

const formFieldVariants = cva(
  "grid",
  {
    variants: {
      spacing: {
        default: "gap-2",
        sm: "gap-1",
        lg: "gap-3",
      },
    },
    defaultVariants: {
      spacing: "default",
    },
  }
);

export type FormFieldProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof formFieldVariants> & {
    label?: string;
    htmlFor?: string;
    error?: string;
    required?: boolean;
    description?: string;
  };

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ 
    className, 
    spacing, 
    label, 
    htmlFor, 
    error, 
    required, 
    description, 
    children, 
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(formFieldVariants({ spacing, className }))}
      {...props}
    >
      {label && (
        <Label 
          htmlFor={htmlFor}
          className={cn(
            "text-sm font-medium",
            error && "text-destructive"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
);
FormField.displayName = "FormField";

export { FormField, formFieldVariants };