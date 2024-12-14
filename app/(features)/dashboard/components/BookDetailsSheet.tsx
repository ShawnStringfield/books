import { Eye, Calendar, Link as LinkIcon, BookOpen, Tag } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetDescription } from '@/app/components/ui/sheet';
import { Book } from '../types/books';
import { format } from 'date-fns';
import Image from 'next/image';
import { useId } from 'react';
import ReadingProgressBar from './ReadingProgressBar';

interface BookDetailsSheetProps {
  book: Book;
}

const BookDetailsSheet = ({ book }: BookDetailsSheetProps) => {
  const uniqueId = useId();
  const sheetDescriptionId = `book-details-desc-${uniqueId}`;

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
        className="w-3/4 sm:w-[540px] md:min-w-[500px] lg:min-w-[700px] m-4 h-auto rounded-lg bg-gradient-to-br from-white to-blue-50 overflow-y-auto"
        aria-describedby={sheetDescriptionId}
      >
        <SheetDescription className="sr-only">{description}</SheetDescription>

        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
          <div className="md:w-1/3 flex-shrink-0">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                width={180}
                height={270}
                className="rounded-lg shadow-md object-cover"
                priority
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="md:w-2/3 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{book.title}</h2>
              {book.subtitle && <p className="leading-tight mt-2">{book.subtitle}</p>}
              <p className="my-2">by {book.author}</p>
            </div>

            <ReadingProgressBar currentPage={book.currentPage} totalPages={book.totalPages} />

            <div className="pt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {book.status.replace('_', ' ').toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-8">
          <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className="mt-1 text-lg font-medium capitalize">{book.status.replace('_', ' ').toLowerCase()}</p>
          </div>

          <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
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
            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Publisher</h3>
              <p className="mt-1 text-gray-700">{book.publisher}</p>
            </div>
          )}

          {book.categories && book.categories.length > 0 && (
            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
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
            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">ISBN</h3>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-gray-800 font-medium">ISBN:</span>
                <span className="text-gray-600">{book.isbn}</span>
              </div>
            </div>
          )}

          {(book.previewLink || book.infoLink) && (
            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
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
            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Highlights</h3>
              <p className="mt-1 text-gray-700">{book.highlights.length} highlights saved</p>
            </div>
          )}

          {book.description && (
            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1 text-gray-700 line-clamp-4">{book.description}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookDetailsSheet;
