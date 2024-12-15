import { Settings2, ChevronDown } from 'lucide-react';
import { ReadingStatus } from '../types/books';
import StatusButtons from './StatusOptions';
import BookProgressSlider from './BookProgressSlider';
import { useState } from 'react';

interface ReadingControlsProps {
  bookId: string;
  currentPage: number;
  totalPages: number;
  status: ReadingStatus;
  uniqueId: string;
  variant: 'mobile' | 'desktop';
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
  onProgressChange: (value: number[]) => void;
}

const ReadingControls = ({ bookId, currentPage, totalPages, status, uniqueId, variant, onStatusChange, onProgressChange }: ReadingControlsProps) => {
  const [showControls, setShowControls] = useState(false);
  const toggleControls = () => setShowControls((prev: boolean) => !prev);

  return (
    <div className="space-y-2">
      <button
        onClick={toggleControls}
        className="w-full flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 hover:bg-slate-50 transition-colors"
        aria-expanded={showControls}
        aria-controls={`reading-controls-${uniqueId}`}
      >
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          <span className="font-medium text-slate-500">Reading Controls</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showControls ? 'rotate-180' : ''}`} />
      </button>

      <div
        id={`reading-controls-${uniqueId}`}
        className={`transition-all duration-200 ${showControls ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}
      >
        <div className="space-y-8 pt-4 p-4 bg-white rounded-lg border border-slate-100">
          <div className="flex justify-center">
            <StatusButtons bookId={bookId} currentStatus={status} onStatusChange={onStatusChange} size="small" roundedVariant="compact" />
          </div>
          <BookProgressSlider
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onProgressChange}
            uniqueId={uniqueId}
            variant={variant}
            showSlider={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ReadingControls;
