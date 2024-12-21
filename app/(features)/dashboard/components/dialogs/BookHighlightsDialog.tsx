import { Dialog, DialogContent } from '@/app/components/ui/dialog';
import BookHighlights from '../BookHighlights';

interface BookHighlightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
  currentPage: number;
}

export default function BookHighlightsDialog({ open, onOpenChange, bookId, currentPage }: BookHighlightsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] focus-visible:outline-none [&>button]:bg-slate-200 [&>button]:hover:bg-slate-300 [&>button]:transition-colors [&>button]:duration-200 [&>button]:p-1.5 [&>button]:rounded-full [&>button]:scale-85">
        <BookHighlights bookId={bookId} currentPage={currentPage} showForm={true} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
