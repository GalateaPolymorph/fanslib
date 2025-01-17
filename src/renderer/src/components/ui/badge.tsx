import { cn } from "@renderer/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success: "border-transparent bg-green-600 text-white hover:bg-green-600/80",
        warning: "border-transparent bg-yellow-600 text-white hover:bg-yellow-600/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        halfSelected:
          "relative overflow-hidden border-primary text-primary before:absolute before:inset-0 before:text-white before:flex before:items-center before:bg-primary before-clip-path-diagonal-30 before:content-[attr(data-content)] before:justify-center [&.size-default:before]:px-2.5 [&.size-default:before]:py-0.5 [&.size-sm:before]:px-2 [&.size-sm:before]:py-0.5 [&.size-lg:before]:px-3 [&.size-lg:before]:py-1",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-2xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export const Badge = ({ className, variant, size = "default", children, ...props }: BadgeProps) => {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), `size-${size}`, className)}
      data-content={children}
      {...props}
    >
      {children}
    </div>
  );
};
