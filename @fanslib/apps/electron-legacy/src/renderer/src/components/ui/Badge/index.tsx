import { cn } from "@renderer/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "badge badge-soft badge-primary px-4 border border-primary/20",
        secondary: "badge badge-secondary px-4 border border-secondary/40",
        success: "badge badge-soft badge-success px-4 border border-success/20",
        warning: "badge badge-warning px-4 border border-warning/40",
        destructive: "badge badge-soft badge-error px-4 border border-error/20",
        outline: "badge badge-outline border border-primary text-primary px-4",
        halfSelected:
          "badge badge-soft relative overflow-hidden border bg-transparent",
      },
      shape: {
        default: "",
        iconOnly: "aspect-square p-2 size-8 min-w-8",
      },
      size: {
        default: "",
        sm: "badge-sm px-3 [&.iconOnly]:size-6 [&.iconOnly]:min-w-6 [&.iconOnly]:p-1.5",
        lg: "badge-lg px-6 [&.iconOnly]:size-10 [&.iconOnly]:min-w-10 [&.iconOnly]:p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    shape?: "default" | "iconOnly";
    halfSelectedColor?: string;
  };

export const Badge = ({
  className,
  variant,
  size = "default",
  shape = "default",
  halfSelectedColor = "oklch(60% 0.25 292.717)", // Primary color from daisyUI theme
  children,
  ...props
}: BadgeProps) => {
  if (variant === "halfSelected") {
    return (
      <div
        className={cn(
          badgeVariants({ variant, size, shape }),
          `size-${size}`,
          `shape-${shape}`,
          "halfSelected",
          "cursor-default",
          className
        )}
        style={{
          "--half-selected-color": halfSelectedColor,
          color: halfSelectedColor,
          borderColor: halfSelectedColor,
        } as React.CSSProperties & { "--half-selected-color": string }}
        {...props}
      >
        <span className="relative z-0">{children}</span>
        <span
          className="absolute inset-0 flex items-center justify-center text-white z-10"
          style={{
            backgroundColor: halfSelectedColor,
            clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
            borderRadius: "inherit",
          }}
        >
          {children}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        badgeVariants({ variant, size, shape }),
        `size-${size}`,
        `shape-${shape}`,
        shape === "iconOnly" && "iconOnly",
        "cursor-default",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
