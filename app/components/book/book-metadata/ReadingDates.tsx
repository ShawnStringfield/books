import { Calendar, BookOpen } from 'lucide-react';
import { Book, ReadingStatus } from '@/app/stores/types';
import { formatLongDate } from '@/app/utils/dateUtils';

interface ReadingDatesProps {
  book: Book;
}

const ReadingDates = ({ book }: ReadingDatesProps) => {
  return (
    <div className="flex flex-wrap gap-3 text-sm text-mono">
      {book.startDate && (
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-mono" />
          <span>Started {formatLongDate(book.startDate)}</span>
        </div>
      )}
      {book.completedDate && book.status === ReadingStatus.COMPLETED && (
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-green-600" />
          <span>Completed {formatLongDate(book.completedDate)}</span>
        </div>
      )}
    </div>
  );
};

export default ReadingDates;
