import { Card, CardContent } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Book, ReadingStatus } from '../types/books';
import Link from 'next/link';
import StatusButtons from './StatusOptions';
import BookDetailsSheet from './BookDetailsSheet';
import { Eye } from 'lucide-react';

type ProgressDisplayVariant = 'hidden' | 'compact' | 'detailed';

interface BookCardProps {
  book: Book;
  onStatusChange: (bookId: string, status: ReadingStatus) => void;
  progressDisplay?: ProgressDisplayVariant;
  className?: string;
}

const BookCard = ({ book, onStatusChange, progressDisplay = 'hidden', className = '' }: BookCardProps) => {
  const progress = Math.round((book.currentPage / book.totalPages) * 100);

  return (
    <Card
      className={`bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        progressDisplay === 'detailed' ? 'h-[240px]' : 'h-[215px]'
      } focus:outline-none ${className} relative`}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div>
          <Link
            href={`/dashboard/library/${book.id}`}
            className="block group focus:outline-none focus-visible:outline-none"
            aria-label={`View details for ${book.title}`}
          >
            <h4 className="font-semibold text-md group-hover:text-blue-600 transition-colors leading-tight outline-none">{book.title}</h4>
          </Link>
          <p className="text-xs text-gray-600 py-1">by {book.author}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-auto gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1 bg-gray-50 hover:bg-gray-100 transition-colors">
              <BookDetailsSheet book={book} />
            </div>
            <StatusButtons
              bookId={book.id}
              currentStatus={book.status as ReadingStatus}
              onStatusChange={onStatusChange}
              size="small"
              roundedVariant="compact"
            />
          </div>
          <Link
            href={`/dashboard/library/${book.id}`}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-auto rounded-full p-1 bg-gray-50 hover:bg-gray-100"
            aria-label={`View details for ${book.title}`}
          >
            <Eye size={18} />
          </Link>
        </div>

        {progressDisplay === 'detailed' && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Page {book.currentPage} of {book.totalPages}
              </span>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" aria-label={`Reading progress: ${progress}%`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCard;
