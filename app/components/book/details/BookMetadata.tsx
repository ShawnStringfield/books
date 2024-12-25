import { type Book } from "@/app/stores/types";
import EditableGenre from "../EditableGenre";
import { ReadingDates } from "../book-metadata";

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
    <div className="flex flex-col gap-1.5 mt-1">
      <EditableGenre
        genre={book.genre || ""}
        bookId={book.id}
        isEditing={showEditControls}
        onChange={onGenreChange}
      />
      <ReadingDates book={book} />
      {!book.genre && !book.isbn && (
        <span className="italic text-sm text-mono">
          No additional details available
        </span>
      )}
    </div>
  );
}
