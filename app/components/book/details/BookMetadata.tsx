import { type Book } from "@/app/stores/types";
import EditableGenre from "../EditableGenre";
import { ReadingDates } from "../book-metadata";
import BookProgressPercentage from "../BookProgressPercentage";

interface BookMetadataProps {
  book: Required<Book>;
  showEditControls: boolean;
  onGenreChange: (genre: string) => void;
}

export function BookMetadata({
  book,
  showEditControls,
  onGenreChange,
}: BookMetadataProps) {
  return (
    <div className="flex flex-col gap-1 mt-1">
      <p className="text-sm text-mono">
        By: {book.author} • {book.totalPages || 0} pages •{" "}
        <BookProgressPercentage
          currentPage={book.currentPage}
          totalPages={book.totalPages}
        />
      </p>
      <EditableGenre
        genre={book.genre || ""}
        bookId={book.id}
        isEditing={showEditControls}
        onChange={onGenreChange}
        className="mb-2 -mt-1"
      />
      <ReadingDates book={book} className="mt-1" />
      {!book.genre && !book.isbn && (
        <span className="italic text-sm text-mono">
          No additional details available
        </span>
      )}
    </div>
  );
}
