import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@renderer/lib/utils";

const buttonVariants = cva("btn [&_svg]:pointer-events-none [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "btn-primary",
      destructive: "btn-error",
      outline: "btn-outline border-base-300 hover:border-neutral hover:bg-neutral font-normal [&_svg]:size-3.5",
      secondary: "btn-secondary",
      ghost: "btn-ghost border-base-300 hover:border-neutral",
      link: "btn-link",
    },
    size: {
      default: "",
      sm: "btn-sm",
      lg: "btn-lg",
      icon: "btn-square",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
