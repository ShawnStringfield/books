import { Eye, Link as LinkIcon, X, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetDescription, SheetTitle, SheetClose } from '@/app/components/ui/sheet';
import { Book } from '../types/books';
import { ReadingStatus } from '../types/books';
import { useId, useState } from 'react';
import ReadingProgressBar from './ReadingProgressBar';
import { useDashboardStore, selectIsLastBook } from '../stores/useDashboardStore';
import ReadingControls from './ReadingControls';
import BookHighlights from './BookHighlights';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';

interface BookDetailsSheetProps {
  book: Book;
}

const BookDetailsSheet = ({ book }: BookDetailsSheetProps) => {
  const router = useRouter();
  const uniqueId = useId();
  const [showHighlights, setShowHighlights] = useState(false);
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
        className="w-full sm:w-[540px] md:min-w-[500px] lg:min-w-[700px] p-0 m-0 sm:m-4 h-[100dvh] rounded-none sm:rounded-lg bg-gradient-to-br from-white to-blue-50 flex flex-col [&>button]:!ring-0 [&>button]:!outline-none [&>button]:focus:!ring-0 [&>button]:focus:!outline-none [&>button]:focus-visible:!ring-0 [&>button]:focus-visible:!outline-none [&>button]:focus-visible:!ring-offset-0"
        aria-describedby={`book-details-desc-${uniqueId}`}
      >
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="flex gap-4 sm:hidden">
              <div className="flex-1 -mt-1">
                <SheetTitle className="text-2xl font-semibold">
                  <Link href={`/dashboard/library/${book.id}`} className="hover:text-blue-600 transition-colors cursor-pointer">
                    {book.title}
                  </Link>
                </SheetTitle>
                {book.subtitle && <p className="text-lg leading-snug my-4 text-gray-600">{book.subtitle}</p>}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                  <span>by {book.author}</span>
                  <span className="text-slate-300">•</span>
                  <span>{book.totalPages} pages</span>
                </div>
                <div className="my-4 text-slate-500">
                  {book.categories && book.categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {book.categories.map((category: string, index: number) => (
                        <span key={index} className="flex items-center gap-1">
                          <span className="text-sm">{category}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:hidden mt-4 flex flex-col gap-2">
              {book.previewLink && (
                <a
                  href={book.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-white hover:bg-slate-800 transition-colors duration-200 flex-1"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Preview Book</span>
                </a>
              )}
              {book.infoLink && (
                <a
                  href={book.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors duration-200 flex-1"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>More Information</span>
                </a>
              )}
            </div>

            <div className="sm:hidden my-4">
              <ReadingControls
                bookId={book.id}
                currentPage={book.currentPage || 0}
                totalPages={book.totalPages}
                status={book.status as ReadingStatus}
                uniqueId={uniqueId}
                variant="mobile"
                onStatusChange={updateBookStatus}
                onProgressChange={handleProgressChange}
                onDelete={handleDelete}
                isLastBook={isLastBook}
              />
            </div>

            <div className="hidden sm:block flex-grow">
              <div className="flex flex-col h-full">
                <SheetTitle className="text-xl sm:text-2xl font-bold -mt-2">
                  <Link href={`/dashboard/library/${book.id}`} className="hover:text-blue-600 transition-colors cursor-pointer">
                    {book.title}
                  </Link>
                </SheetTitle>
                <SheetDescription className="sr-only">{description}</SheetDescription>

                <div className="space-y-4 mt-4 mb-8">
                  <div>
                    {book.subtitle && <p className="text-sm sm:text-base leading-tight mt-2">{book.subtitle}</p>}
                    <p className="text-sm my-2 text-slate-500">by {book.author}</p>
                    <p className="text-sm text-slate-500">{book.totalPages} pages</p>
                  </div>

                  {(book.previewLink || book.infoLink) && (
                    <div className="flex gap-4">
                      {book.previewLink && (
                        <a
                          href={book.previewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-slate-700 text-white hover:bg-slate-800 transition-colors duration-200 flex-1"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Preview Book</span>
                        </a>
                      )}
                      {book.infoLink && (
                        <a
                          href={book.infoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors duration-200 flex-1"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>More Information</span>
                        </a>
                      )}
                    </div>
                  )}

                  <ReadingControls
                    bookId={book.id}
                    currentPage={book.currentPage || 0}
                    totalPages={book.totalPages}
                    status={book.status as ReadingStatus}
                    uniqueId={uniqueId}
                    variant="desktop"
                    onStatusChange={updateBookStatus}
                    onProgressChange={handleProgressChange}
                    onDelete={handleDelete}
                    isLastBook={isLastBook}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="my-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHighlights(!showHighlights)}
              className="w-full flex items-center justify-center gap-2 mb-4"
            >
              <Plus className="h-4 w-4" />
              {showHighlights ? 'Hide Form' : 'Add Highlight'}
            </Button>
            <BookHighlights bookId={book.id} currentPage={book.currentPage || 0} showForm={showHighlights} onClose={() => setShowHighlights(false)} />
          </div>
        </div>

        <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-t px-4 sm:px-6 py-4 sm:py-6">
          <ReadingProgressBar
            currentPage={book.currentPage}
            totalPages={book.totalPages}
            progress={Math.min(Math.round((book.currentPage / book.totalPages) * 100), 100)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookDetailsSheet;
