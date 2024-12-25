import { Card, CardContent } from "@/app/components/ui/card";
import { Book, ReadingStatusType } from "@/app/stores/types";
import Link from "next/link";
import BookDetailsSheet from "./BookDetailsSheet";
import { Trash2, Highlighter, Eye } from "lucide-react";
import { useMemo } from "react";
import { useHighlightsByBook } from "@/app/hooks/highlights/useHighlights";
import ReadingStatusSelect from "./ReadingStatusSelect";

interface BookCardProps {
  book: Book;
  onStatusChange: (bookId: string, status: ReadingStatusType) => void;
  onDelete?: (bookId: string) => void;
  className?: string;
}

const BookCard = ({
  book,
  onStatusChange,
  onDelete,
  className = "",
}: BookCardProps) => {
  const { data: highlights = [] } = useHighlightsByBook(book.id || "");
  const { highlightsCount, latestHighlight } = useMemo(() => {
    const sortedHighlights = highlights.sort((a, b) => {
      const dateA = new Date(a.modifiedAt || a.createdAt).getTime();
      const dateB = new Date(b.modifiedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    return {
      highlightsCount: highlights.length,
      latestHighlight: sortedHighlights[0],
    };
  }, [highlights]);

  const handleDelete = () => {
    if (onDelete && book.id) {
      onDelete(book.id);
    }
  };

  const baseClassName =
    "bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <Card className={finalClassName}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <Link
                href={`/dashboard/library/${book.id}`}
                className="block group focus:outline-none focus-visible:outline-none"
                aria-label={`View details for ${book.title}`}
              >
                <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors leading-tight outline-none truncate">
                  {book.title}
                </h4>
              </Link>
              <p className="text-xs text-gray-600 truncate">by {book.author}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
              <Highlighter size={12} className="text-gray-400" />
              <span>{highlightsCount}</span>
            </div>
          </div>

          {highlightsCount === 0 ? (
            <div className="flex items-center gap-2">
              <Highlighter size={14} className="text-gray-400 shrink-0" />
              <p className="text-xs text-gray-500">
                Start capturing your favorite moments.
              </p>
            </div>
          ) : (
            latestHighlight && (
              <div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {latestHighlight.text}
                </p>
              </div>
            )
          )}

          <div className="flex items-center gap-2">
            <ReadingStatusSelect
              status={book.status}
              onStatusChange={(status) => onStatusChange(book.id || "", status)}
              size="sm"
            />
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              <BookDetailsSheet book={book}>
                <button
                  className="rounded-full p-1 bg-gray-50 hover:bg-gray-100 transition-colors"
                  aria-label="Quick look at book details"
                >
                  <Eye size={14} className="text-gray-500" aria-hidden="true" />
                </button>
              </BookDetailsSheet>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600 transition-colors rounded-full p-1 bg-red-50 hover:bg-red-100"
                aria-label="Delete book"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
