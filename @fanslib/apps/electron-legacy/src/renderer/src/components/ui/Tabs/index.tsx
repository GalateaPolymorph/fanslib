import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { cn } from "../../../lib/utils";

const tabsVariants = cva("tabs", {
  variants: {
    variant: {
      default: "",
      border: "tabs-border",
      box: "tabs-box",
    },
    size: {
      xs: "tabs-xs",
      sm: "tabs-sm",
      md: "tabs-md",
      lg: "tabs-lg",
      xl: "tabs-xl",
    },
    placement: {
      bottom: "tabs-bottom",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

type TabItem = {
  id: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  items: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  name?: string;
} & VariantProps<typeof tabsVariants>;

export const Tabs = ({
  items,
  onTabChange,
  variant,
  size,
  placement,
  className,
  tabClassName,
  contentClassName,
  name = `tabs-${Math.random().toString(36).substr(2, 9)}`,
}: TabsProps) => {
  return (
    <div className={cn(tabsVariants({ variant, size, placement }), className)}>
      {items.map((item, index) => (
        <>
          <input
            defaultChecked={index === 0}
            type="radio"
            name={name}
            className={cn("tab", tabClassName, { "tab-disabled": item.disabled })}
            aria-label={typeof item.label === "string" ? item.label : `Tab ${index + 1}`}
            onChange={() => !item.disabled && onTabChange?.(item.id)}
            disabled={item.disabled}
          />
          {item.content && (
            <div
              className={cn(
                "tab-content bg-base-100 border-base-300 rounded-box p-6",
                contentClassName
              )}
            >
              {item.content}
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export type { TabItem, TabsProps };
