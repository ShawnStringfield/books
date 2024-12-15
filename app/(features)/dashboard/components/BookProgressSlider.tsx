import { BookOpen } from 'lucide-react';
import { Slider } from '@/app/components/ui/slider';
import { usePageProgress } from '../hooks/usePageProgress';

interface BookProgressSliderProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (value: number[]) => void;
  uniqueId: string;
  variant?: 'mobile' | 'desktop';
  showSlider?: boolean;
}

const BookProgressSlider = ({ currentPage, totalPages, onPageChange, uniqueId, variant = 'desktop', showSlider = true }: BookProgressSliderProps) => {
  const sliderId = `${variant}-pages-${uniqueId}`;
  const inputId = `${variant}-input-${uniqueId}`;

  const { inputValue, handleInputChange, handleInputBlur, handleSliderChange, pagesRemaining } = usePageProgress({
    initialPage: currentPage,
    totalPages,
    onPageChange,
  });

  return (
    <div className="w-full">
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
            className="w-12 px-3 py-1 text-xs border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="text-xs text-gray-500">{pagesRemaining} pages remaining</div>
        </>
      )}
    </div>
  );
};

export default BookProgressSlider;
