import { Eye, Calendar, Link as LinkIcon, BookOpen, Tag } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetDescription, SheetTitle } from '@/app/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Book } from '../types/books';
import { ReadingStatus } from '../types/books';
import { format } from 'date-fns';
import Image from 'next/image';
import { useId } from 'react';
import ReadingProgressBar from './ReadingProgressBar';
import { cleanDescription, toTitleCase } from '@/app/utils/textUtils';
import { useDashboardStore } from '../stores/useDashboardStore';
import { Input } from '@/app/components/ui/input';

interface BookDetailsSheetProps {
  book: Book;
}

const BookDetailsSheet = ({ book }: BookDetailsSheetProps) => {
  const uniqueId = useId();
  const sheetDescriptionId = `book-details-desc-${uniqueId}`;
  const updateBookStatus = useDashboardStore((state) => state.updateBookStatus);
  const updateReadingProgress = useDashboardStore((state) => state.updateReadingProgress);

  const description = book.subtitle || `Details for ${book.title}`;

  const handleStatusChange = (value: string) => {
    updateBookStatus(book.id, value as ReadingStatus);
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(e.target.value);
    if (!isNaN(newPage) && newPage >= 0 && newPage <= book.totalPages) {
      updateReadingProgress(book.id, newPage);

      // Automatically update status based on pages read
      if (newPage === 0) {
        updateBookStatus(book.id, ReadingStatus.NOT_STARTED);
      } else if (newPage === book.totalPages) {
        updateBookStatus(book.id, ReadingStatus.COMPLETED);
      } else if (newPage > 0) {
        updateBookStatus(book.id, ReadingStatus.IN_PROGRESS);
      }
    }
  };

  const calculateProgress = () => {
    if (book.status === ReadingStatus.COMPLETED) {
      return 100;
    }
    if (!book.currentPage || book.currentPage === 0) {
      return 0;
    }
    return Math.min(Math.round((book.currentPage / book.totalPages) * 100), 99);
  };

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
        className="w-full sm:w-[540px] md:min-w-[500px] lg:min-w-[700px] p-4 sm:p-6 m-0 sm:m-4 h-[100dvh] sm:h-auto rounded-none sm:rounded-lg bg-gradient-to-br from-white to-blue-50 overflow-y-auto [&>button]:!ring-0 [&>button]:!outline-none [&>button]:focus:!ring-0 [&>button]:focus:!outline-none [&>button]:focus-visible:!ring-0 [&>button]:focus-visible:!outline-none [&>button]:focus-visible:!ring-offset-0"
        aria-describedby={sheetDescriptionId}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 mt-8 sm:mt-12">
          <div className="flex gap-4 sm:hidden">
            <div className="flex-shrink-0">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={`Cover of ${book.title}`}
                  width={80}
                  height={120}
                  className="rounded-md shadow-sm object-cover border border-gray-200"
                  priority
                />
              ) : (
                <div className="w-[80px] aspect-[2/3] bg-gray-100 rounded-md flex items-center justify-center shadow-sm border border-gray-200">
                  <BookOpen className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 -mt-1">
              <SheetTitle className="text-lg font-semibold sm:text-2xl sm:font-bold">{book.title}</SheetTitle>
              {book.subtitle && <p className="text-xs sm:text-sm leading-tight mt-1 sm:mt-2 text-gray-600">{book.subtitle}</p>}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-1">
                <span>by {book.author}</span>
                <span className="text-slate-300">•</span>
                <span>{book.totalPages} pages</span>
              </div>
            </div>
          </div>

          <div className="sm:hidden mt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor={`mobile-pages-${uniqueId}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Current Page
                </label>
                <Input
                  id={`mobile-pages-${uniqueId}`}
                  type="number"
                  min={0}
                  max={book.totalPages}
                  value={book.currentPage || 0}
                  onChange={handlePageChange}
                  className="w-full"
                />
              </div>
              <Select value={book.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full bg-blue-300/20 border-blue-300 hover:bg-blue-300/30 transition-colors">
                  <SelectValue placeholder="Select status">{toTitleCase(book.status)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReadingStatus.NOT_STARTED}>Not Started</SelectItem>
                  <SelectItem value={ReadingStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={ReadingStatus.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden sm:block flex-grow">
            <SheetTitle className="text-xl sm:text-2xl font-bold">{book.title}</SheetTitle>
            <SheetDescription className="sr-only">{description}</SheetDescription>

            <div className="space-y-4 mt-4 mb-8 sm:mb-32">
              <div>
                {book.subtitle && <p className="text-sm sm:text-base leading-tight mt-2">{book.subtitle}</p>}
                <p className="text-sm my-2 text-slate-500">by {book.author}</p>
                <p className="text-sm text-slate-500">{book.totalPages} pages</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor={`desktop-pages-${uniqueId}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Current Page
                  </label>
                  <Input
                    id={`desktop-pages-${uniqueId}`}
                    type="number"
                    min={0}
                    max={book.totalPages}
                    value={book.currentPage || 0}
                    onChange={handlePageChange}
                    className="w-[180px]"
                  />
                </div>
                <div className="pt-2">
                  <Select value={book.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-blue-300/20 border-blue-300 hover:bg-blue-300/30 transition-colors">
                      <SelectValue placeholder="Select status">{toTitleCase(book.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ReadingStatus.NOT_STARTED}>Not Started</SelectItem>
                      <SelectItem value={ReadingStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={ReadingStatus.COMPLETED}>Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:block flex-shrink-0 sm:w-[140px]">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                width={140}
                height={210}
                className="rounded-lg shadow-[0_10px_20px_-3px_rgba(0,0,0,0.15)] object-cover ml-auto transform -translate-y-4 hover:-translate-y-5 transition-all duration-300 hover:shadow-[0_15px_25px_-3px_rgba(0,0,0,0.2)]"
                priority
              />
            ) : (
              <div className="w-[140px] aspect-[2/3] bg-gray-100 rounded-lg flex items-center justify-center ml-auto transform -translate-y-4 hover:-translate-y-5 transition-all duration-300">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="my-8">
          {book.description && (
            <div className="my-4 sm:my-8">
              <h3 className="text-muted-foreground">About This Book</h3>
              <p className="text-sm mt-1 text-gray-700 line-clamp-6 sm:line-clamp-none">{cleanDescription(book.description)}</p>
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

        <div className="fixed bottom-0 left-0 right-0 sm:relative bg-white sm:bg-transparent p-4 sm:p-0">
          <ReadingProgressBar currentPage={book.currentPage} totalPages={book.totalPages} progress={calculateProgress()} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookDetailsSheet;
