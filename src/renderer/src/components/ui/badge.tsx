import { cn } from "@renderer/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground hover:bg-primary/80 [&.shape-tag]:border-none",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success: "border border-transparent bg-green-600 text-white hover:bg-green-600/80",
        warning: "border border-transparent bg-yellow-600 text-white hover:bg-yellow-600/80",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border text-foreground [&.shape-tag]:bg-muted [&.shape-tag]:border-none",
        halfSelected:
          "relative overflow-hidden text-[--half-selected-color] border-[--half-selected-color] before:absolute before:inset-0 before:text-white before:flex before:items-center before:bg-[var(--half-selected-color)] before-clip-path-diagonal-30 before:content-[attr(data-content)] before:justify-center [&.size-default:before]:px-2.5 [&.size-default:before]:py-0.5 [&.size-sm:before]:px-2 [&.size-sm:before]:py-0.5 [&.size-lg:before]:px-3 [&.size-lg:before]:py-1",
      },
      shape: {
        default: "rounded-full",
        tag: "",
        iconOnly: "rounded aspect-square p-0.5 size-5",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-1 py-0.5 text-2xs",
        lg: "px-3 py-1 text-sm",
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
    shape?: "default" | "tag" | "iconOnly";
  };

export const Badge = ({
  className,
  variant,
  size = "default",
  shape = "default",
  children,
  ...props
}: BadgeProps) => {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size, shape }),
        `size-${size}`,
        `shape-${shape}`,
        "cursor-default",
        className
      )}
      data-content={children}
      style={{
        clipPath: shape === "tag" ? "polygon(15% 0, 90% 0, 90% 100%, 15% 100%, 0 50%)" : undefined,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
