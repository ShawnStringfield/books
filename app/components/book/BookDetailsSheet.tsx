import { Eye, Link as LinkIcon, X, Trash2, Settings2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetDescription, SheetTitle, SheetClose, SheetHeader } from '@/app/components/ui/sheet';
import { Book } from '@/app/stores/types';
import { useId, useState } from 'react';
import ReadingProgressBar from './ReadingProgressBar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BookHighlights from '@/app/components/highlights/BookHighlights';
import { DeleteBookDialog } from '@/app/components/dialogs/DeleteBookDialog';
import Toolbar, { ToolbarAction } from '@/app/components/dashboard/Toolbar';
import ReadingControls from '@/app/components/book/ReadingControls';
import { calculatePercentComplete } from '@/app/utils/bookUtils';
import { useDeleteBook, useUpdateReadingProgress, useBooks } from '@/app/hooks/books/useBooks';

interface BookDetailsSheetProps {
  book: Book;
}

const BookDetailsSheet = ({ book }: BookDetailsSheetProps) => {
  const router = useRouter();
  const uniqueId = useId();
  const [showHighlights, setShowHighlights] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReadingControls, setShowReadingControls] = useState(false);
  const [manualTotalPages, setManualTotalPages] = useState('');
  const { data: books = [] } = useBooks();
  const deleteBookMutation = useDeleteBook();
  const updateProgressMutation = useUpdateReadingProgress();
  const isLastBook = books.length === 1;

  const handleDelete = () => {
    if (!isLastBook) {
      deleteBookMutation.mutate(book.id);
      router.push('/dashboard/library');
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newPage = value[0];
    updateProgressMutation.mutate({ bookId: book.id, currentPage: newPage });
  };

  const handleTotalPagesUpdate = (value: number) => {
    if (value > 0) {
      // First update the reading progress to ensure current page is valid
      const newCurrentPage = Math.min(book.currentPage || 0, value);
      updateProgressMutation.mutate({ bookId: book.id, currentPage: newCurrentPage });

      setManualTotalPages('');
      setShowReadingControls(false);
    }
  };

  const toolbarActions: ToolbarAction[] = [
    {
      icon: Eye,
      label: 'View Highlights',
      onClick: () => setShowHighlights(!showHighlights),
      variant: showHighlights ? 'outline' : 'default',
    },
    {
      icon: Settings2,
      label: 'Reading Controls',
      onClick: () => setShowReadingControls(!showReadingControls),
      variant: showReadingControls ? 'outline' : 'default',
    },
    {
      icon: Trash2,
      label: 'Delete Book',
      onClick: () => setShowDeleteDialog(true),
      variant: 'destructive',
    },
  ];

  const description = `${book.title} by ${book.author}`;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-full text-left">
          <ReadingProgressBar
            currentPage={book.currentPage}
            totalPages={book.totalPages}
            progress={calculatePercentComplete(book.currentPage, book.totalPages)}
            variant="bleed"
          />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <div className="flex flex-col h-full">
          <ReadingProgressBar
            currentPage={book.currentPage}
            totalPages={book.totalPages}
            progress={calculatePercentComplete(book.currentPage, book.totalPages)}
            variant="bleed"
          />

          <SheetHeader className="px-4 sm:px-6 pt-4">
            <div className="flex justify-between items-center mb-4">
              <Toolbar actions={toolbarActions} className="mt-8" />
              <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6">
              <div className="flex-grow">
                <SheetTitle className="text-xl sm:text-2xl font-bold">
                  <Link href={`/dashboard/library/${book.id}`} className="hover:text-blue-600 transition-colors cursor-pointer">
                    {book.title}
                  </Link>
                </SheetTitle>
                <SheetDescription className="sr-only">{description}</SheetDescription>

                <div className="space-y-8 mb-4">
                  <div>
                    {book.subtitle && <p className="text-sm sm:text-base mt-2">{book.subtitle}</p>}

                    <div className="flex items-center gap-2 my-2">
                      <p className="text-sm my-2 text-slate-500">by {book.author}</p>
                      <p className="text-sm text-slate-500">• {book.totalPages} pages</p>
                    </div>

                    {(book.previewLink || book.infoLink) && (
                      <div className="flex gap-4 mt-2 text-sm text-slate-600">
                        {book.previewLink && (
                          <a
                            href={book.previewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </a>
                        )}
                        {book.infoLink && (
                          <a
                            href={book.infoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>More info</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {book.description && <p className="text-sm text-slate-600">{book.description}</p>}

                  {book.categories && book.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {book.categories.map((category) => (
                        <span key={category} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {showReadingControls && (
              <ReadingControls
                bookId={book.id}
                currentPage={book.currentPage}
                totalPages={book.totalPages}
                status={book.status}
                uniqueId={uniqueId}
                variant="desktop"
                onStatusChange={() => {}}
                onProgressChange={handleProgressChange}
                onCancel={() => setShowReadingControls(false)}
                manualTotalPages={manualTotalPages}
                onManualTotalPagesChange={setManualTotalPages}
                onTotalPagesUpdate={handleTotalPagesUpdate}
                onDelete={() => setShowDeleteDialog(true)}
                isLastBook={isLastBook}
                fromGoogle={book.fromGoogle}
              />
            )}

            {showHighlights && (
              <BookHighlights bookId={book.id} currentPage={book.currentPage} showForm={showHighlights} onClose={() => setShowHighlights(false)} />
            )}
          </div>
        </div>
      </SheetContent>

      <DeleteBookDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDelete} bookTitle={book.title} />
    </Sheet>
  );
};

export default BookDetailsSheet;
