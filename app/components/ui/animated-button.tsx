import * as React from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { type ButtonProps } from "./button";

interface AnimatedButtonProps extends ButtonProps {
  transitionColors?: {
    from: string;
    to: string;
  };
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, transitionColors, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const buttonStyles = React.useMemo(() => {
      if (!transitionColors) return "";

      return cn(
        "transition-colors duration-300",
        isHovered ? transitionColors.to : transitionColors.from
      );
    }, [transitionColors, isHovered]);

    return (
      <Button
        ref={ref}
        className={cn(buttonStyles, className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      />
    );
  }
);
AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
export type { AnimatedButtonProps };
