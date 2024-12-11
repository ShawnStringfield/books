import { Eye } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { Book } from '../types/books';

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
        className="w-3/4 sm:w-[540px] md:min-w-[500px] lg:min-w-[700px] m-4 h-auto rounded-lg bg-gradient-to-br from-white to-blue-50"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-2xl font-bold text-blue-900">{book.title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 animate-fadeIn">
          <div className="space-y-8">
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
              <h3 className="text-sm font-medium text-blue-600">ISBN</h3>
              <p className="mt-1 text-lg">{book?.isbn || 'Not available'}</p>
            </div>

            {book.description && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600">Description</h3>
                <p className="mt-1 text-gray-700 line-clamp-4">{book.description}</p>
              </div>
            )}

            {book?.notes && (
              <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600">Notes</h3>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">{book?.notes || 'No notes available'}</p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookDetailsSheet;
