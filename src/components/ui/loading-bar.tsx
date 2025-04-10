
import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The progress value between 0-100. If not provided, shows an indeterminate animation.
   */
  progress?: number;
  /**
   * Whether to show an indeterminate loading animation
   */
  indeterminate?: boolean;
  /**
   * The height of the loading bar
   */
  height?: string;
  /**
   * The color variant of the loading bar
   */
  variant?: "default" | "primary" | "secondary" | "accent";
}

const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>(
  ({ 
    className,
    progress,
    indeterminate = false,
    height = "h-1",
    variant = "primary",
    ...props
  }, ref) => {
    const isIndeterminate = indeterminate || progress === undefined;
    
    const getVariantClass = () => {
      switch (variant) {
        case "primary":
          return "bg-primary";
        case "secondary":
          return "bg-secondary";
        case "accent":
          return "bg-accent";
        default:
          return "bg-primary";
      }
    };

    return (
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          height,
          className
        )}
        {...props}
        ref={ref}
      >
        <div
          className={cn(
            getVariantClass(),
            "h-full transition-all duration-300 ease-in-out",
            isIndeterminate ? "animate-loading-bar" : ""
          )}
          style={{
            width: isIndeterminate ? "100%" : `${Math.max(0, Math.min(100, progress || 0))}%`,
            backgroundSize: isIndeterminate ? "200% 100%" : undefined,
          }}
        />
      </div>
    );
  }
);

LoadingBar.displayName = "LoadingBar";

export { LoadingBar };
