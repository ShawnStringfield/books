import { Settings2, ChevronDown, Trash2, Book } from 'lucide-react';
import { ReadingStatus } from '../types/books';
import StatusButtons from './StatusOptions';
import BookProgressSlider from './BookProgressSlider';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';

interface ReadingControlsProps {
  bookId: string;
  currentPage: number;
  totalPages: number;
  status: ReadingStatus;
  uniqueId: string;
  variant: 'mobile' | 'desktop';
  size?: 'default' | 'small';
  className?: string;
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
  onProgressChange: (value: number[]) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isLastBook?: boolean;
  showEditControls?: boolean;
  onSaveChanges?: () => void;
}

const ReadingControls = ({
  bookId,
  currentPage,
  totalPages,
  status,
  uniqueId,
  variant,
  size = 'default',
  className,
  onStatusChange,
  onProgressChange,
  onEdit,
  onDelete,
  isLastBook,
  showEditControls,
  onSaveChanges,
}: ReadingControlsProps) => {
  const [showControls, setShowControls] = useState(false);
  const toggleControls = () => setShowControls((prev: boolean) => !prev);
  const pagesRemaining = totalPages - currentPage;

  return (
    <div className={cn('space-y-2', className)}>
      <button
        onClick={toggleControls}
        className={cn(
          'w-full flex items-center justify-between rounded-lg bg-white border border-slate-100 hover:bg-slate-50 transition-colors',
          size === 'default' ? 'p-3' : 'p-2'
        )}
        aria-expanded={showControls}
        aria-controls={`reading-controls-${uniqueId}`}
      >
        <div className="flex items-center gap-2">
          <Settings2 className={size === 'default' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          <span className={cn('font-medium text-slate-500', size === 'default' ? 'text-base' : 'text-sm')}>Reading Controls</span>
        </div>
        <ChevronDown className={cn('w-4 h-4 transition-transform', showControls && 'transform rotate-180')} />
      </button>

      {showControls && (
        <div id={`reading-controls-${uniqueId}`} className="space-y-6 p-4 bg-white border border-slate-100 rounded-lg">
          <div className="space-y-3">
            <div className="text-sm text-slate-600">Reading Status</div>
            <StatusButtons bookId={bookId} currentStatus={status} onStatusChange={onStatusChange} size={size} />
          </div>

          <div className="space-y-3">
            <div className="text-sm text-slate-600">Reading Progress</div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4 text-slate-400" />
                <div className="text-sm text-slate-600">Current Page:</div>
                <div className="flex-1" />
                <div className="text-sm">
                  <span className="font-medium">{currentPage}</span>
                  <span className="text-slate-400"> / {totalPages}</span>
                </div>
              </div>
              <BookProgressSlider
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onProgressChange}
                variant={variant}
                uniqueId={uniqueId}
              />
              <div className="text-sm text-slate-500">{pagesRemaining} pages remaining</div>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-end gap-2">
            {showEditControls ? (
              <>
                <Button variant="outline" size="sm" onClick={onEdit} className="text-xs py-1 px-2">
                  Cancel
                </Button>
                <Button size="sm" onClick={onSaveChanges} className="text-xs py-1 px-2">
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={onEdit} className="text-xs py-1 px-2">
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs py-1 px-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:hover:text-gray-500"
                  onClick={onDelete}
                  disabled={isLastBook}
                  title={isLastBook ? 'Cannot delete the last book' : undefined}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingControls;
