import { cn } from "@/app/lib/utils";
import { calculatePercentComplete } from "@/app/utils/bookUtils";

type ProgressVariant = "default" | "verbose";

interface BookProgressPercentageProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  variant?: ProgressVariant;
}

const BookProgressPercentage = ({
  currentPage,
  totalPages,
  className,
  variant = "default",
}: BookProgressPercentageProps) => {
  const percentComplete = calculatePercentComplete(currentPage, totalPages);

  return (
    <span className={cn("text-xs", className)}>
      {percentComplete}%{variant === "verbose" && " Complete"}
    </span>
  );
};

export default BookProgressPercentage;
