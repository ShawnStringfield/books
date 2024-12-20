import { BookOpen } from 'lucide-react';
import { Slider } from '@/app/components/ui/slider';
import { usePageProgress } from '../hooks/usePageProgress';
import { cn } from '@/lib/utils';

interface BookProgressSliderProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (value: number[]) => void;
  uniqueId: string;
  variant?: 'mobile' | 'desktop';
  showSlider?: boolean;
  showPercentage?: boolean;
  className?: string;
}

const BookProgressSlider = ({
  currentPage,
  totalPages,
  onPageChange,
  uniqueId,
  variant = 'desktop',
  showSlider = true,
  showPercentage = false,
  className,
}: BookProgressSliderProps) => {
  const sliderId = `${variant}-pages-${uniqueId}`;
  const inputId = `${variant}-input-${uniqueId}`;

  const { inputValue, handleInputChange, handleInputBlur, handleSliderChange, pagesRemaining } = usePageProgress({
    initialPage: currentPage,
    totalPages,
    onPageChange,
  });

  const percentComplete = Math.min(Math.round((currentPage / totalPages) * 100), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <BookOpen className="w-4 h-4" />
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
            className="w-10 px-2 py-1 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Enter current page number"
          />
          <span className="text-xs text-gray-500">/ {totalPages}</span>
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
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{pagesRemaining} pages remaining</span>
            {showPercentage && <span>({percentComplete}%)</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default BookProgressSlider;
