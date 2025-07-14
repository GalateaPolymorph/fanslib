import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@renderer/lib/utils";

const loadingSkeletonVariants = cva(
  "animate-pulse bg-muted rounded",
  {
    variants: {
      variant: {
        default: "bg-muted",
        card: "bg-muted",
        text: "bg-muted",
        avatar: "bg-muted rounded-full",
        button: "bg-muted",
      },
      size: {
        sm: "h-3",
        default: "h-4", 
        lg: "h-5",
        xl: "h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type LoadingSkeletonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof loadingSkeletonVariants> & {
    width?: string;
    height?: string;
  };

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, variant, size, width, height, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(loadingSkeletonVariants({ variant, size, className }))}
      style={{ width, height, ...style }}
      {...props}
    />
  )
);
LoadingSkeleton.displayName = "LoadingSkeleton";

// Preset skeleton components for common use cases
const SkeletonText = ({ lines = 1, className, ..._props }: { lines?: number } & Omit<LoadingSkeletonProps, "variant">) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }, (_, i) => (
      <LoadingSkeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? "75%" : "100%"}
        {..._props}
      />
    ))}
  </div>
);

const SkeletonCard = ({ className, ...props }: Omit<LoadingSkeletonProps, "variant">) => (
  <div className={cn("space-y-3 p-4 border rounded-lg", className)} {...props}>
    <LoadingSkeleton variant="text" width="60%" size="lg" />
    <SkeletonText lines={2} />
    <LoadingSkeleton variant="button" width="100px" height="32px" />
  </div>
);

const SkeletonAvatar = ({ size = "default", className, ...props }: { size?: "sm" | "default" | "lg" } & Omit<LoadingSkeletonProps, "variant" | "size">) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    default: "w-10 h-10", 
    lg: "w-12 h-12",
  };
  
  return (
    <LoadingSkeleton
      variant="avatar"
      className={cn(sizeClasses[size], className)}
      {...props}
    />
  );
};

const SkeletonGrid = ({ 
  items = 6, 
  columns = 3,
  className,
  ...props 
}: { 
  items?: number;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
} & Omit<LoadingSkeletonProps, "variant">) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
  };

  return (
    <div className={cn("grid gap-4", gridClasses[columns], className)}>
      {Array.from({ length: items }, (_, i) => (
        <SkeletonCard key={i} {...props} />
      ))}
    </div>
  );
};

export { 
  LoadingSkeleton, 
  loadingSkeletonVariants,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonGrid,
};