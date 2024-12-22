import { Settings2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import ReadingControls from '../book/ReadingControls';
import { ReadingStatus } from '@/app/stores/types';

interface ReadingControlsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  currentPage: number;
  totalPages: number;
  status: (typeof ReadingStatus)[keyof typeof ReadingStatus];
  onStatusChange: (bookId: string, newStatus: (typeof ReadingStatus)[keyof typeof ReadingStatus]) => Promise<void>;
  onProgressChange: (value: number[]) => void;
  onDelete: () => void;
  isLastBook: boolean;
}

export default function ReadingControlsDialog({
  open,
  onOpenChange,
  bookId,
  currentPage,
  totalPages,
  status,
  onStatusChange,
  onProgressChange,
  onDelete,
  isLastBook,
}: ReadingControlsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] focus-visible:outline-none text-brand-strong [&>button]:bg-brand-subtle [&>button]:hover:bg-brand-muted [&>button]:transition-colors [&>button]:duration-200 [&>button]:p-1.5 [&>button]:rounded-full [&>button]:scale-85">
        <DialogHeader className="border-b pb-4 -mx-6 px-6">
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Reading Controls
          </DialogTitle>
          <DialogDescription>Update your reading progress and manage book settings</DialogDescription>
        </DialogHeader>
        <ReadingControls
          bookId={bookId}
          currentPage={currentPage}
          totalPages={totalPages}
          status={status}
          uniqueId={bookId}
          variant="mobile"
          onStatusChange={onStatusChange}
          onProgressChange={onProgressChange}
          onDelete={onDelete}
          onCancel={() => onOpenChange(false)}
          isLastBook={isLastBook}
        />
      </DialogContent>
    </Dialog>
  );
}
