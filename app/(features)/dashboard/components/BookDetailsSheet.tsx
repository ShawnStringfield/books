import { Eye, Calendar, Link as LinkIcon, BookOpen, Tag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { Book } from '../types/books';
import { format } from 'date-fns';

interface BookDetailsSheetProps {
  book: Book;
}

const BookDetailsSheet = ({ book }: BookDetailsSheetProps) => {
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
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-2xl font-bold text-blue-900">{book.title}</SheetTitle>
          {book.subtitle && <p className="text-lg text-blue-700 mt-2">{book.subtitle}</p>}
        </SheetHeader>
        <div className="mt-6 animate-fadeIn">
          <div className="space-y-8">
            {book.coverUrl && (
              <div className="flex justify-center">
                <img src={book.coverUrl} alt={`Cover of ${book.title}`} className="rounded-lg shadow-lg max-h-[300px] object-contain" />
              </div>
            )}

            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">Author</h3>
              <p className="mt-1 text-lg font-semibold">{book.author}</p>
            </div>

            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">Progress</h3>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.round((book.currentPage / book.totalPages) * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-lg">
                  Page {book.currentPage} of {book.totalPages} ({Math.round((book.currentPage / book.totalPages) * 100)}%)
                </p>
              </div>
            </div>

            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">Status</h3>
              <p className="mt-1 text-lg font-medium capitalize">{book.status.replace('_', ' ').toLowerCase()}</p>
            </div>

            <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600">Reading Dates</h3>
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
                <h3 className="text-sm font-medium text-blue-600">Publisher</h3>
                <p className="mt-1 text-gray-700">{book.publisher}</p>
              </div>
            )}

            {book.categories && book.categories.length > 0 && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600">Categories</h3>
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

            {(book.previewLink || book.infoLink) && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600">External Links</h3>
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
                <h3 className="text-sm font-medium text-blue-600">Highlights</h3>
                <p className="mt-1 text-gray-700">{book.highlights.length} highlights saved</p>
              </div>
            )}

            {book.description && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600">Description</h3>
                <p className="mt-1 text-gray-700 line-clamp-4">{book.description}</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookDetailsSheet;
