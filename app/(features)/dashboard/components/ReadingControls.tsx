import { Settings2, Trash2, AlertCircle } from 'lucide-react';
import { ReadingStatus } from '../types/books';
import StatusButtons from './StatusOptions';
import BookProgressSlider from './BookProgressSlider';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { useState } from 'react';

interface ReadingControlsProps {
  bookId: string;
  currentPage: number;
  totalPages: number;
  status: ReadingStatus;
  uniqueId: string;
  variant: 'mobile' | 'desktop' | 'icon';
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
  const [showWarning, setShowWarning] = useState(false);

  const handleStatusChange = (bookId: string, newStatus: ReadingStatus) => {
    if (newStatus === ReadingStatus.NOT_STARTED && currentPage > 0) {
      setShowWarning(true);
    } else {
      onStatusChange(bookId, newStatus);
    }
  };

  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-10 w-10 rounded-full hover:bg-slate-100')}
          aria-expanded="true"
          aria-controls={`reading-controls-${uniqueId}`}
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)} id={`reading-controls-${uniqueId}`}>
      {/* Reading Status Section */}
      <div className="space-y-3">
        <StatusButtons bookId={bookId} currentStatus={status} onStatusChange={handleStatusChange} size={size} />

        {showWarning && (
          <div className="flex items-center gap-2 p-3 text-sm bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <div className="flex-1 text-amber-800">Changing to &ldquo;Not Started&rdquo; will reset your reading progress to 0 pages.</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-xs hover:bg-amber-100" onClick={() => setShowWarning(false)}>
                Cancel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs hover:bg-amber-100"
                onClick={() => {
                  setShowWarning(false);
                  onStatusChange(bookId, ReadingStatus.NOT_STARTED);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Reading Progress Section */}
      <div className="space-y-4">
        <BookProgressSlider currentPage={currentPage} totalPages={totalPages} onPageChange={onProgressChange} variant={variant} uniqueId={uniqueId} />
      </div>

      {/* Action Buttons */}
      {(onEdit || onDelete || showEditControls) && (
        <>
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
                  variant="secondary"
                  size="sm"
                  className="text-xs py-1 px-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:hover:text-gray-500"
                  onClick={onDelete}
                  disabled={isLastBook}
                  title={isLastBook ? 'Cannot delete the last book' : undefined}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Book
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReadingControls;
