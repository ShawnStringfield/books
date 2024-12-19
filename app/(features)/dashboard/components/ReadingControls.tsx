import { Settings2, Trash2 } from 'lucide-react';
import { ReadingStatus } from '../types/books';
import StatusButtons from './StatusOptions';
import BookProgressSlider from './BookProgressSlider';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { Progress } from '@/app/components/ui/progress';

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
  const progress = Math.round((currentPage / totalPages) * 100);
  const pagesRemaining = totalPages - currentPage;

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
        <div className="text-sm font-medium text-slate-600">Reading Status</div>
        <StatusButtons bookId={bookId} currentStatus={status} onStatusChange={onStatusChange} size={size} />
      </div>

      {/* Reading Progress Section */}
      <div className="space-y-4">
        <div className="text-sm font-medium text-slate-600">Reading Progress</div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{progress}% Complete</span>
            <span>{pagesRemaining} pages remaining</span>
          </div>
        </div>

        {/* Page Controls */}
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
        </>
      )}
    </div>
  );
};

export default ReadingControls;
