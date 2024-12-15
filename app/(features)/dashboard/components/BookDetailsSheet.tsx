import { Eye, Calendar, Link as LinkIcon, BookOpen, Tag, X, ChevronDown, Settings2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetDescription, SheetTitle, SheetClose } from '@/app/components/ui/sheet';
import { Book } from '../types/books';
import { ReadingStatus } from '../types/books';
import { format } from 'date-fns';
import { useId, useState } from 'react';
import ReadingProgressBar from './ReadingProgressBar';
import { cleanDescription, toTitleCase } from '@/app/utils/textUtils';
import { useDashboardStore } from '../stores/useDashboardStore';
import BookProgressSlider from './BookProgressSlider';
import StatusButtons from './StatusOptions';

interface BookDetailsSheetProps {
  book: Book;
}

const BookDetailsSheet = ({ book }: BookDetailsSheetProps) => {
  const uniqueId = useId();
  const sheetDescriptionId = `book-details-desc-${uniqueId}`;
  const updateBookStatus = useDashboardStore((state) => state.updateBookStatus);
  const updateReadingProgress = useDashboardStore((state) => state.updateReadingProgress);
  const [showProgress, setShowProgress] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);

  const description = book.subtitle || `Details for ${book.title}`;

  const handleProgressChange = (value: number[]) => {
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
  };

  const toggleProgress = () => setShowProgress((prev) => !prev);
  const toggleMobileControls = () => setShowMobileControls((prev) => !prev);

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
              </div>
            </div>

            <div className="sm:hidden my-8">
              <button
                onClick={toggleMobileControls}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors"
                aria-expanded={showMobileControls}
                aria-controls="mobile-reading-controls"
              >
                <div className="flex items-center gap-2 text-slate-500">
                  <Settings2 className="w-4 h-4" />
                  <span className="font-medium">Reading Controls</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMobileControls ? 'rotate-180' : ''}`} />
              </button>

              <div
                id="mobile-reading-controls"
                className={`space-y-8 mt-8 transition-all duration-200 ${
                  showMobileControls ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'
                }`}
              >
                <StatusButtons bookId={book.id} currentStatus={book.status as ReadingStatus} onStatusChange={updateBookStatus} variant="full-width" />
                <BookProgressSlider
                  currentPage={book.currentPage || 0}
                  totalPages={book.totalPages}
                  onPageChange={handleProgressChange}
                  uniqueId={uniqueId}
                  variant="mobile"
                  showSlider={true}
                />
              </div>
            </div>

            <div className="hidden sm:block flex-grow">
              <div className="flex flex-col h-full">
                <SheetTitle className="text-xl sm:text-2xl font-bold -mt-2">{book.title}</SheetTitle>
                <SheetDescription className="sr-only">{description}</SheetDescription>

                <div className="space-y-4 mt-4 mb-8 sm:mb-32">
                  <div>
                    {book.subtitle && <p className="text-sm sm:text-base leading-tight mt-2">{book.subtitle}</p>}
                    <p className="text-sm my-2 text-slate-500">by {book.author}</p>
                    <p className="text-sm text-slate-500">{book.totalPages} pages</p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={toggleProgress}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors"
                      aria-expanded={showProgress}
                      aria-controls={`progress-section-${uniqueId}`}
                    >
                      <div className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        <span className="font-medium text-slate-500">Reading Controls</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProgress ? 'rotate-180' : ''}`} />
                    </button>

                    <div
                      id={`progress-section-${uniqueId}`}
                      className={`transition-all duration-200 ${showProgress ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}
                    >
                      <div className="space-y-8 pt-4">
                        <StatusButtons
                          bookId={book.id}
                          currentStatus={book.status as ReadingStatus}
                          onStatusChange={updateBookStatus}
                          variant="full-width"
                        />
                        <BookProgressSlider
                          currentPage={book.currentPage || 0}
                          totalPages={book.totalPages}
                          onPageChange={handleProgressChange}
                          uniqueId={uniqueId}
                          variant="desktop"
                          showSlider={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-16">
            {book.description && (
              <div className="">
                <h3 className="text-muted-foreground">About This Book</h3>
                <p className="text-xs mt-1 text-gray-700 line-clamp-6 sm:line-clamp-none">{cleanDescription(book.description)}</p>
              </div>
            )}
          </div>
          <div className="my-16 space-y-4 sm:space-y-8">
            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Current Progress</h3>
              <div className="mt-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-lg font-medium">{toTitleCase(book.status)}</span>
              </div>
            </div>

            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Reading Dates</h3>
              <div className="mt-2 space-y-2">
                {book.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Started: {format(new Date(book.startDate), 'PPP')}</span>
                  </div>
                )}
                {book.completedDate && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span>Completed: {format(new Date(book.completedDate), 'PPP')}</span>
                  </div>
                )}
              </div>
            </div>

            {book.publisher && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Publisher</h3>
                <p className="mt-1 text-gray-700">{book.publisher}</p>
              </div>
            )}

            {book.categories && book.categories.length > 0 && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {book.categories.map((category, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      <Tag className="w-3 h-3" />
                      <span className="text-sm">{category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {book.isbn && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">ISBN</h3>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-800 font-medium">ISBN:</span>
                  <span className="text-gray-600">{book.isbn}</span>
                </div>
              </div>
            )}

            {(book.previewLink || book.infoLink) && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">External Links</h3>
                <div className="mt-2 space-y-2">
                  {book.previewLink && (
                    <a
                      href={book.previewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Preview Book</span>
                    </a>
                  )}
                  {book.infoLink && (
                    <a
                      href={book.infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>More Information</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {book.highlights && book.highlights.length > 0 && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Highlights</h3>
                <p className="mt-1 text-gray-700">{book.highlights.length} highlights saved</p>
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
