import { Card, CardContent } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Book, ReadingStatusType } from '@/app/stores/types';
import Link from 'next/link';
import BookDetailsSheet from './BookDetailsSheet';
import { Trash2, Highlighter } from 'lucide-react';
import { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { readingStatusOptions } from '@/app/config/readingStatusConfig';
import { useBookStore, selectEnrichedHighlights } from '@/app/stores/useBookStore';
import { getHighlightsByBook } from '@/app/utils/highlightUtils';

type ProgressDisplayVariant = 'hidden' | 'compact' | 'detailed';

interface BookCardProps {
  book: Book;
  onStatusChange: (bookId: string, status: ReadingStatusType) => void;
  onDelete?: (bookId: string) => void;
  progressDisplay?: ProgressDisplayVariant;
  className?: string;
}

const BookCard = ({ book, onStatusChange, onDelete, progressDisplay = 'hidden', className = '' }: BookCardProps) => {
  const progress = Math.round((book.currentPage / book.totalPages) * 100);

  const enrichedHighlights = useBookStore(selectEnrichedHighlights);
  const bookHighlights = useMemo(() => {
    const highlights = getHighlightsByBook(enrichedHighlights, book.id);
    return highlights.sort((a, b) => {
      const dateA = new Date(a.modifiedAt || a.createdAt).getTime();
      const dateB = new Date(b.modifiedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }, [enrichedHighlights, book.id]);

  const { highlightsCount, latestHighlight } = useMemo(() => {
    return {
      highlightsCount: bookHighlights.length,
      latestHighlight: bookHighlights[0],
    };
  }, [bookHighlights]);

  const handleDelete = () => {
    onDelete?.(book.id);
  };

  return (
    <Card
      className={`bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 h-[280px] focus:outline-none ${className} relative`}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0 flex-1">
            <Link
              href={`/dashboard/library/${book.id}`}
              className="block group focus:outline-none focus-visible:outline-none"
              aria-label={`View details for ${book.title}`}
            >
              <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors leading-tight outline-none truncate">{book.title}</h4>
            </Link>
            <p className="text-xs text-gray-600 py-1 truncate">by {book.author}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
            <Highlighter size={14} className="text-gray-400" />
            <span>
              {highlightsCount} highlight{highlightsCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {highlightsCount === 0 ? (
          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-2">
              <Highlighter size={16} className="text-gray-400" />
              <p className="text-xs text-gray-500">Start capturing your favorite moments. </p>
            </div>
          </div>
        ) : (
          latestHighlight && (
            <div className="mt-3 mb-2">
              <p className="text-xs text-gray-500 line-clamp-3">{latestHighlight.text}</p>
            </div>
          )
        )}

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

        <div className="flex items-center gap-2 mt-auto pt-4">
          <Select defaultValue={book.status} onValueChange={(value) => onStatusChange(book.id, value as ReadingStatusType)}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {readingStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{option.icon}</span>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <div className="rounded-full p-1.5 bg-gray-50 hover:bg-gray-100 transition-colors">
            <BookDetailsSheet book={book} />
          </div>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 transition-colors rounded-full p-1.5 bg-red-50 hover:bg-red-100"
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
