import { Eye, Link as LinkIcon, X, Plus, Trash2, Settings2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetDescription, SheetTitle, SheetClose, SheetHeader } from '@/app/components/ui/sheet';
import { Book } from '../types/books';
import { useId, useState } from 'react';
import ReadingProgressBar from './ReadingProgressBar';
import { useDashboardStore, selectIsLastBook } from '../stores/useDashboardStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BookHighlights from './BookHighlights';
import BookProgressSlider from './BookProgressSlider';
import { DeleteBookDialog } from './DeleteBookDialog';
import Toolbar, { ToolbarAction } from './Toolbar';
import ReadingControls from './ReadingControls';
import StatusButtons from './StatusButtons';

interface BookDetailsSheetProps {
  book: Book;
}

const BookDetailsSheet = ({ book }: BookDetailsSheetProps) => {
  const router = useRouter();
  const uniqueId = useId();
  const [showHighlights, setShowHighlights] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReadingControls, setShowReadingControls] = useState(false);
  const { updateBookStatus, updateReadingProgress, deleteBook } = useDashboardStore();
  const isLastBook = useDashboardStore(selectIsLastBook);

  const handleDelete = () => {
    if (!isLastBook) {
      deleteBook(book.id);
      router.push('/dashboard/library');
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newPage = value[0];
    updateReadingProgress(book.id, newPage);
  };

  const description = book.subtitle || `Details for ${book.title}`;

  const toolbarActions: ToolbarAction[] = [
    {
      icon: Trash2,
      label: 'Delete book',
      onClick: () => setShowDeleteDialog(true),
      variant: 'destructive',
      disabled: isLastBook,
    },
    {
      icon: Settings2,
      label: showReadingControls ? 'Hide reading controls' : 'Show reading controls',
      onClick: () => setShowReadingControls(!showReadingControls),
      variant: showReadingControls ? 'outline' : 'default',
    },
    {
      icon: Plus,
      label: showHighlights ? 'Hide highlight form' : 'Add highlight',
      onClick: () => setShowHighlights(!showHighlights),
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-110 text-gray-600 hover:text-blue-600"
          aria-label={`Quick view ${book.title}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-[540px] md:min-w-[500px] lg:min-w-[700px] p-0 h-[100dvh] rounded-none bg-gradient-to-br from-white to-blue-50 flex flex-col [&>button]:hidden overflow-hidden"
        aria-describedby={`book-details-desc-${uniqueId}`}
      >
        <ReadingProgressBar
          currentPage={book.currentPage}
          totalPages={book.totalPages}
          progress={Math.min(Math.round((book.currentPage / book.totalPages) * 100), 100)}
          variant="bleed"
        />

        <SheetHeader className="px-4 sm:px-6 pt-4">
          <div className="flex justify-between items-center mb-4">
            <Toolbar actions={toolbarActions} className="my-4" />
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
                  {book.subtitle && <p className="text-sm sm:text-base leading-tight mt-2">{book.subtitle}</p>}
                  <p className="text-sm my-2 text-slate-500">by {book.author}</p>
                  <p className="text-sm text-slate-500">{book.totalPages} pages</p>
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

                {showReadingControls && (
                  <ReadingControls
                    bookId={book.id}
                    currentPage={book.currentPage}
                    totalPages={book.totalPages}
                    status={book.status}
                    uniqueId={uniqueId}
                    variant="desktop"
                    onStatusChange={updateBookStatus}
                    onProgressChange={handleProgressChange}
                    onDelete={handleDelete}
                    onCancel={() => setShowReadingControls(false)}
                    isLastBook={isLastBook}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="my-8">
            <BookHighlights
              bookId={book.id}
              currentPage={book.currentPage || 0}
              showForm={showHighlights}
              onClose={() => setShowHighlights(false)}
              highlightLimit={5}
            />
          </div>
        </div>
      </SheetContent>

      <DeleteBookDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDelete} bookTitle={book.title} />
    </Sheet>
  );
};

export default BookDetailsSheet;
