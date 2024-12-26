import { type Book } from "@/app/stores/types";
import { SheetDescription } from "@/app/components/ui/sheet";
import { ExternalLink } from "lucide-react";
import { BookDescription } from "@/app/components/book/details/BookDescription";
import { BookHeader } from "@/app/components/book/details/BookHeader";
import Image from "next/image";

interface BookDetailsContentProps {
  book: Book;
}

export function BookDetailsContent({ book }: BookDetailsContentProps) {
  const description = `${book.title} by ${book.author}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6">
        {book.coverUrl && (
          <div className="flex-shrink-0 w-32 sm:w-48">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md">
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 8rem, 12rem"
                priority
              />
            </div>
          </div>
        )}
        <div className="flex-grow">
          <BookHeader
            book={book as Required<Book>}
            showEditControls={false}
            onCancelEdit={() => {}}
            onSaveChanges={() => {}}
            onGenreChange={() => {}}
          />
          <SheetDescription className="sr-only">{description}</SheetDescription>

          <div className="space-y-4 mt-4">
            {book.publisher && (
              <p className="text-sm text-slate-600">
                Published by {book.publisher}
                {book.publishDate &&
                  ` • ${new Date(book.publishDate).getFullYear()}`}
              </p>
            )}

            {(book.previewLink || book.infoLink) && (
              <div className="flex gap-4 text-sm text-slate-600">
                {book.previewLink && (
                  <a
                    href={book.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-brand hover:text-blue-800 transition-colors"
                    aria-label="Preview book"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Preview
                  </a>
                )}
                {book.infoLink && (
                  <a
                    href={book.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-brand hover:text-blue-800 transition-colors"
                    aria-label="More information about book"
                  >
                    <ExternalLink className="h-4 w-4" />
                    More Information
                  </a>
                )}
              </div>
            )}

            {book.isbn && (
              <p className="text-sm text-slate-600">ISBN: {book.isbn}</p>
            )}
          </div>
        </div>
      </div>

      <BookDescription
        book={book as Required<Book>}
        showEditControls={false}
        onDescriptionChange={() => {}}
      />
    </div>
  );
}
