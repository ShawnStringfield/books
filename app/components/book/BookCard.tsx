import { Card, CardContent } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Book, ReadingStatusType } from '@/app/stores/types';
import Link from 'next/link';
import StatusButtons from './StatusButtons';
import BookDetailsSheet from './BookDetailsSheet';
import { Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

type ProgressDisplayVariant = 'hidden' | 'compact' | 'detailed';

interface BookCardProps {
  book: Book;
  onStatusChange: (bookId: string, status: ReadingStatusType) => void;
  onDelete?: (bookId: string) => void;
  isLastBook?: boolean;
  progressDisplay?: ProgressDisplayVariant;
  className?: string;
}

const BookCard = ({ book, onStatusChange, onDelete, isLastBook = false, progressDisplay = 'hidden', className = '' }: BookCardProps) => {
  const progress = Math.round((book.currentPage / book.totalPages) * 100);
  const [showWarning, setShowWarning] = useState(false);

  const handleDelete = () => {
    if (isLastBook) {
      setShowWarning(true);
      // Hide warning after 3 seconds
      setTimeout(() => setShowWarning(false), 3000);
    } else {
      onDelete?.(book.id);
    }
  };

  return (
    <Card
      className={`bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        progressDisplay === 'detailed' ? 'h-[280px]' : 'h-[255px]'
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
          <StatusButtons bookId={book.id} currentStatus={book.status} onStatusChange={onStatusChange} size="small" align="left" />
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

        <div className="flex justify-end items-center gap-2 mt-4 pt-4 ">
          <div className="flex-1">
            {showWarning && isLastBook && (
              <div className="flex items-center text-amber-600 text-xs">
                <AlertCircle size={14} className="mr-1" />
                Cannot delete the last book
              </div>
            )}
          </div>
          <div className="rounded-full p-1.5 bg-gray-50 hover:bg-gray-100 transition-colors">
            <BookDetailsSheet book={book} />
          </div>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors rounded-full p-1.5 bg-gray-50 hover:bg-red-50"
            aria-label="Delete book"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
