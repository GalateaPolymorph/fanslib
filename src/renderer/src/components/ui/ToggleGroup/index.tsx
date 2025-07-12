import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@renderer/lib/utils";
import * as React from "react";
import { toggleVariants } from "../Toggle";

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md bg-transparent p-1",
      className
    )}
    {...props}
  />
));

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      toggleVariants({
        variant: "ghost",
        size: "sm",
      }),
      "data-[state=on]:bg-muted data-[state=on]:text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));

ToggleGroup.displayName = "ToggleGroup";
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
