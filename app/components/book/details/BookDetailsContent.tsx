import { type Book } from "@/app/stores/types";
import { SheetDescription } from "@/app/components/ui/sheet";
import { LinkIcon } from "lucide-react";
import { BookDescription } from "@/app/components/book/details/BookDescription";
import { BookHeader } from "@/app/components/book/details/BookHeader";

interface BookDetailsContentProps {
  book: Book;
}

export function BookDetailsContent({ book }: BookDetailsContentProps) {
  const description = `${book.title} by ${book.author}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6">
        <div className="flex-grow">
          <BookHeader
            book={book as Required<Book>}
            showEditControls={false}
            onCancelEdit={() => {}}
            onSaveChanges={() => {}}
            onGenreChange={() => {}}
          />
          <SheetDescription className="sr-only">{description}</SheetDescription>

          <div className="space-y-8 mb-4">
            {(book.previewLink || book.infoLink) && (
              <div className="flex gap-4 mt-2 text-sm text-slate-600"></div>
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
