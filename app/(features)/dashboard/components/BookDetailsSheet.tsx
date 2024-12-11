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
          className="hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800"
          aria-label={`Quick view ${book.title}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-3/4 sm:w-[540px] md:min-w-[500px] lg:min-w-[700px] m-4 h-auto rounded-lg">
        <SheetHeader>
          <SheetTitle>{book.title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Author</h3>
              <p className="mt-1 text-lg">{book.author}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Progress</h3>
              <p className="mt-1 text-lg">
                Page {book.currentPage} of {book.totalPages} ({Math.round((book.currentPage / book.totalPages) * 100)}%)
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 text-lg capitalize">{book.status.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookDetailsSheet;
