import { Settings2, Trash2 } from 'lucide-react';
import { ReadingStatus } from '@/app/stores/types';
import StatusButtons from './StatusButtons';
import BookProgressSlider from './BookProgressSlider';
import { cn } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import { useState } from 'react';
import WarningAlert from '@/app/components/ui/warning-alert';

interface ReadingControlsProps {
  bookId: string;
  currentPage: number;
  totalPages: number;
  status: (typeof ReadingStatus)[keyof typeof ReadingStatus];
  uniqueId: string;
  variant: 'mobile' | 'desktop' | 'icon';
  size?: 'default' | 'small';
  className?: string;
  onStatusChange: (bookId: string, status: (typeof ReadingStatus)[keyof typeof ReadingStatus]) => void;
  onProgressChange: (value: number[]) => void;
  onDelete: () => void;
  onCancel?: () => void;
  isLastBook?: boolean;
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
  onDelete,
  onCancel,
  isLastBook,
}: ReadingControlsProps) => {
  const [showWarning, setShowWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleStatusChange = (bookId: string, newStatus: (typeof ReadingStatus)[keyof typeof ReadingStatus]) => {
    if (newStatus === ReadingStatus.NOT_STARTED && currentPage > 0) {
      setShowWarning(true);
    } else {
      onStatusChange(bookId, newStatus);
    }
  };

  const handleDeleteClick = () => {
    if (isLastBook) return;
    setShowDeleteWarning(true);
  };

  const warningActions = [
    {
      label: 'Cancel',
      onClick: () => setShowWarning(false),
      variant: 'ghost' as const,
      className: 'text-amber-500',
    },
    {
      label: 'Confirm',
      onClick: () => {
        setShowWarning(false);
        onStatusChange(bookId, ReadingStatus.NOT_STARTED);
      },
      variant: 'ghost' as const,
      className: 'text-amber-800 ',
    },
  ];

  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-10 w-10 rounded-full hover:bg-brand-muted')}
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
        <StatusButtons bookId={bookId} currentStatus={status} onStatusChange={handleStatusChange} size={size} align="left" className="my-4" />

        {showWarning && (
          <WarningAlert
            message="Changing to &ldquo;Not Started&rdquo; will reset your reading progress to 0 pages."
            variant="warning"
            actions={warningActions}
          />
        )}
      </div>

      {/* Reading Progress Section */}
      <BookProgressSlider
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onProgressChange}
        variant={variant}
        uniqueId={uniqueId}
        showPercentage={true}
        className="space-y-1"
      />

      {/* Action Buttons */}
      {onDelete !== undefined && (
        <>
          <Separator className="my-2 " />
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" size="sm" className="text-xs py-1 px-2 bg-brand-fill text-brand-textweak" onClick={onCancel}>
                Close
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="text-xs py-1 px-2 text-white hover:text-red-600 disabled:opacity-50 disabled:hover:text-gray-500"
                onClick={handleDeleteClick}
                disabled={isLastBook}
                title={isLastBook ? 'Cannot delete the last book' : undefined}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Book
              </Button>
            </div>

            {showDeleteWarning && (
              <WarningAlert
                message="Are you sure you want to delete this book? This action cannot be undone."
                variant="danger"
                actions={[
                  {
                    label: 'Cancel',
                    onClick: () => setShowDeleteWarning(false),
                  },
                  {
                    label: 'Delete',
                    onClick: () => {
                      setShowDeleteWarning(false);
                      onDelete();
                    },
                    variant: 'destructive',
                  },
                ]}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReadingControls;
