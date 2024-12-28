import { cn } from "../../lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { ArrowRight } from "lucide-react";

const featureCardVariants = cva(
  "group relative rounded-lg border transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-white border-gray-200 hover:border-gray-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
        emphasis:
          "bg-mono-strong border-gray-800 hover:bg-gray-800 hover:border-gray-700",
        subtle: "bg-gray-50 border-gray-100 hover:border-gray-200",
        ghost: "border-transparent hover:bg-gray-50",
      },
      size: {
        default: "p-8",
        sm: "p-6",
        lg: "p-10",
      },
      font: {
        default: "font-sans",
        mono: "font-mono",
        display: "font-display",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      font: "default",
    },
  }
);

interface FeatureCardProps extends VariantProps<typeof featureCardVariants> {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  onClick?: () => void;
  showArrow?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon,
  variant,
  size,
  font,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
  onClick,
  showArrow,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        featureCardVariants({ variant, size, font }),
        "relative",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative">
        <div className={cn("w-5 h-5 mb-4", iconClassName)}>{icon}</div>
        <h3
          className={cn(
            "text-lg leading-tight font-semibold mb-2",
            variant === "emphasis" && "text-gray-50",
            titleClassName
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-sm",
            variant === "emphasis" && " text-mono-subtle",
            descriptionClassName
          )}
        >
          {description}
        </p>
      </div>
      {showArrow && (
        <div className="absolute bottom-8 right-8">
          <div className="p-2 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
            <ArrowRight className="w-4 h-4 text-gray-50" />
          </div>
        </div>
      )}
    </div>
  );
}
