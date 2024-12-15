import { Calendar, BookOpen } from 'lucide-react';
import { Book } from '../../types/books';
import { format } from 'date-fns';

interface ReadingDatesProps {
  book: Book;
}

const ReadingDates = ({ book }: ReadingDatesProps) => {
  return (
    <div className="transition-all duration-300 hover:bg-white hover:shadow-md p-3 sm:p-4 rounded-lg">
      <h3 className="text-sm font-medium text-muted-foreground">Reading Dates</h3>
      <div className="mt-2 space-y-2">
        {book.startDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Started: {format(typeof book.startDate === 'string' ? new Date(book.startDate) : book.startDate, 'PPP')}</span>
          </div>
        )}
        {book.completedDate && (
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <span>Completed: {format(typeof book.completedDate === 'string' ? new Date(book.completedDate) : book.completedDate, 'PPP')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingDates;
