import { Eye, Link as LinkIcon, Star, StarOff, Trash2, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetDescription, SheetTitle, SheetClose } from '@/app/components/ui/sheet';
import { Book } from '../types/books';
import { ReadingStatus } from '../types/books';
import { useId, useState, useMemo, useCallback } from 'react';
import ReadingProgressBar from './ReadingProgressBar';
import { useDashboardStore } from '../stores/useDashboardStore';
import ReadingControls from './ReadingControls';
import { Button } from '@/app/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface BookDetailsSheetProps {
  book: Book;
}

const BookDetailsSheet = ({ book }: BookDetailsSheetProps) => {
  const uniqueId = useId();
  const sheetDescriptionId = `book-details-desc-${uniqueId}`;
  const updateBookStatus = useDashboardStore((state) => state.updateBookStatus);
  const updateReadingProgress = useDashboardStore((state) => state.updateReadingProgress);
  const addHighlight = useDashboardStore((state) => state.addHighlight);
  const deleteHighlight = useDashboardStore((state) => state.deleteHighlight);
  const toggleFavoriteHighlight = useDashboardStore((state) => state.toggleFavoriteHighlight);
  const allHighlights = useDashboardStore((state) => state.highlights);
  const [newHighlight, setNewHighlight] = useState('');

  // Memoize filtered highlights to prevent unnecessary recalculations
  const highlights = useMemo(() => {
    return allHighlights.filter((h) => h.bookId === book.id);
  }, [allHighlights, book.id]);

  const description = book.subtitle || `Details for ${book.title}`;

  const handleProgressChange = useCallback(
    (value: number[]) => {
      const newPage = value[0];
      updateReadingProgress(book.id, newPage);

      // Automatically update status based on pages read
      if (newPage === 0) {
        updateBookStatus(book.id, ReadingStatus.NOT_STARTED);
      } else if (newPage === book.totalPages) {
        updateBookStatus(book.id, ReadingStatus.COMPLETED);
      } else if (newPage > 0) {
        updateBookStatus(book.id, ReadingStatus.IN_PROGRESS);
      }
    },
    [book.id, book.totalPages, updateBookStatus, updateReadingProgress]
  );

  const handleAddHighlight = useCallback(() => {
    if (!newHighlight.trim()) return;

    addHighlight(book.id, {
      text: newHighlight,
      page: book.currentPage || 0,
      isFavorite: false,
    });
    setNewHighlight('');
  }, [addHighlight, book.id, book.currentPage, newHighlight]);

  const handleToggleFavorite = useCallback(
    (highlightId: string) => {
      toggleFavoriteHighlight(highlightId);
    },
    [toggleFavoriteHighlight]
  );

  const handleDeleteHighlight = useCallback(
    (highlightId: string) => {
      deleteHighlight(highlightId);
    },
    [deleteHighlight]
  );

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
        aria-describedby={sheetDescriptionId}
      >
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="flex gap-4 sm:hidden">
              <div className="flex-1 -mt-1">
                <SheetTitle className="text-2xl font-semibold">{book.title}</SheetTitle>
                {book.subtitle && <p className="text-lg leading-snug my-4 text-gray-600">{book.subtitle}</p>}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                  <span>by {book.author}</span>
                  <span className="text-slate-300">•</span>
                  <span>{book.totalPages} pages</span>
                </div>
                <div className="my-4 text-slate-500">
                  {book.categories && book.categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {book.categories.map((category, index) => (
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
              />
            </div>

            <div className="hidden sm:block flex-grow">
              <div className="flex flex-col h-full">
                <SheetTitle className="text-xl sm:text-2xl font-bold -mt-2">{book.title}</SheetTitle>
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
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="my-16 space-y-4 sm:space-y-8">
            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Add Highlight</h3>
              <div className="space-y-2">
                <textarea
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="Add a highlight from your current page..."
                  className="w-full px-3 py-2 border rounded-lg min-h-[100px] text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  aria-label="New highlight text"
                />
                <Button onClick={handleAddHighlight} disabled={!newHighlight.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Add Highlight
                </Button>
              </div>
            </div>

            {highlights.length > 0 && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Highlights</h3>
                <div className="space-y-4">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="group relative p-4 bg-gray-50 rounded-lg space-y-2 hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-gray-800 text-sm">{highlight.text}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(highlight.id)}
                            className={`text-yellow-500 hover:text-yellow-600 ${highlight.isFavorite ? 'bg-yellow-50' : ''}`}
                            aria-label={highlight.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {highlight.isFavorite ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteHighlight(highlight.id)}
                            className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            aria-label="Delete highlight"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Page {highlight.page} • {formatDistanceToNow(new Date(highlight.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
