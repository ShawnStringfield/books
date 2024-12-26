import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Slider } from "@/app/components/ui/slider";
import { usePageProgress } from "@/app/hooks/books/usePageProgress";
import { cn } from "@/app/lib/utils";
import BookProgressPercentage from "./BookProgressPercentage";

interface BookProgressSliderProps {
  bookId: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (value: number[]) => void | Promise<void>;
  uniqueId: string;
  variant?: "mobile" | "desktop";
  showSlider?: boolean;
  showPercentage?: boolean;
  className?: string;
}

const BookProgressSlider = ({
  bookId,
  currentPage,
  totalPages,
  onPageChange,
  uniqueId,
  variant = "desktop",
  showSlider = true,
  showPercentage = false,
  className,
}: BookProgressSliderProps) => {
  const sliderId = `${variant}-pages-${uniqueId}`;
  const inputId = `${variant}-input-${uniqueId}`;

  const {
    inputValue,
    handleInputChange,
    handleInputBlur,
    handleSliderChange,
    pagesRemaining,
    error: pageProgressError,
  } = usePageProgress({
    bookId,
    initialPage: currentPage,
    totalPages,
    onPageChange: async (value) => {
      if (!pageProgressError) {
        await onPageChange(value);
      }
    },
  });

  if (!bookId) {
    console.error("Book ID is required for BookProgressSlider");
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="flex items-center gap-2 text-xs font-medium "
        >
          <BookOpen className="w-4 h-4 " />
          Current Page:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            id={inputId}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={0}
            max={totalPages}
            className="w-10 px-2 py-1 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-fill"
            aria-label="Enter current page number"
          />
          <span className="text-xs">/ {totalPages}</span>
        </div>
      </div>
      {showSlider && (
        <>
          <div>
            <Slider
              id={sliderId}
              value={[parseInt(inputValue) || 0]}
              max={totalPages}
              min={0}
              step={1}
              onValueChange={handleSliderChange}
              className="py-2"
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span>{pagesRemaining} pages remaining</span>
            {showPercentage && (
              <BookProgressPercentage
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookProgressSlider;
