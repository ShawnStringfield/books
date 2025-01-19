import { Card, CardContent } from "@/app/components/ui/card";
import { Book, ReadingStatusType } from "@/app/stores/types";
import Link from "next/link";
import BookDetailsSheet from "./details/BookDetailsSheet";
import { Trash2, Eye } from "lucide-react";
import { useMemo } from "react";
import { useHighlightsByBook } from "@/app/hooks/highlights/useHighlights";
import ReadingStatusSelect from "./ReadingStatusSelect";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/avatar";
import Image from "next/image";

interface BookCardProps {
  book: Book;
  onStatusChange: (bookId: string, status: ReadingStatusType) => void;
  onDelete?: (bookId: string) => void;
  className?: string;
  showCover?: boolean;
  variant?: "avatar" | "full";
}

const BookCard = ({
  book,
  onStatusChange,
  onDelete,
  className = "",
  showCover = false,
  variant = "avatar",
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
    "bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none h-[200px]";
  const finalClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  const renderCover = () => {
    if (!showCover) return null;

    if (variant === "avatar") {
      return (
        <Avatar className="h-12 w-12">
          {book.coverUrl ? (
            <AvatarImage
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {book.title.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      );
    }

    return (
      <div className="relative aspect-[2/3] w-20 rounded-lg overflow-hidden shadow-sm">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">
              {book.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={finalClassName}>
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex h-full gap-4">
          <div className="flex-shrink-0">{renderCover()}</div>
          <div className="flex flex-col flex-1">
            {/* Header Section */}
            <div className="flex justify-between items-start gap-2 mb-2">
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
                <p className="text-xs text-gray-600 truncate">
                  by {book.author}
                </p>
              </div>
            </div>

            {/* Highlights Section - Flex Grow to Take Available Space */}
            <div className="flex-1 min-h-0">
              {highlightsCount === 0 ? (
                <div className="flex items-center gap-2 mt-4">
                  <p className="text-xs text-gray-500 pt-4">
                    Start capturing your favorite moments.
                  </p>
                </div>
              ) : (
                latestHighlight && (
                  <p className="text-xs text-mono line-clamp-2 mt-2">
                    {latestHighlight.text}
                  </p>
                )
              )}
            </div>

            {/* Footer Section */}
            <div className="flex items-center gap-2 mt-4">
              <ReadingStatusSelect
                status={book.status}
                onStatusChange={(status) =>
                  onStatusChange(book.id || "", status)
                }
                size="sm"
              />
              <div className="flex-1" />
              <div className="flex items-center gap-1">
                <BookDetailsSheet book={book}>
                  <button
                    className="rounded-full p-1 bg-gray-50 hover:bg-gray-100 transition-colors"
                    aria-label="Quick look at book details"
                  >
                    <Eye
                      size={14}
                      className="text-gray-500"
                      aria-hidden="true"
                    />
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
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
