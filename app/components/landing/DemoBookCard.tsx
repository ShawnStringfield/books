"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Book, ReadingStatusType } from "@/app/stores/types";
import { Trash2, Plus, Highlighter } from "lucide-react";
import ReadingStatusSelect from "@/app/components/book/ReadingStatusSelect";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";

interface DemoBookCardProps {
  book: Book;
  onStatusChange: (bookId: string, status: ReadingStatusType) => void;
  onDelete?: (bookId: string) => void;
  className?: string;
  onAddHighlight?: () => void;
}

export function DemoBookCard({
  book,
  onStatusChange,
  onDelete,
  className = "",
  onAddHighlight,
}: DemoBookCardProps) {
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
        <div className="flex gap-4">
          {book.coverUrl && (
            <div className="flex-shrink-0 w-24">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-sm">
                <Image
                  src={book.coverUrl}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 96px) 96px"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col flex-1 gap-2">
            <div>
              <h4 className="font-semibold text-lg leading-tight">
                {book.title}
              </h4>
              <p className="text-sm text-gray-600">by {book.author}</p>
            </div>

            {book.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {book.description}
              </p>
            )}

            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${(book.currentPage / book.totalPages) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {Math.round((book.currentPage / book.totalPages) * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ReadingStatusSelect
                  status={book.status}
                  onStatusChange={(status) =>
                    onStatusChange(book.id || "", status)
                  }
                  size="sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAddHighlight}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" />
                  <Highlighter className="w-3 h-3" />
                </Button>
                <div className="flex-1" />
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600 transition-colors rounded-full p-1.5 bg-red-50 hover:bg-red-100"
                  aria-label="Delete book"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
