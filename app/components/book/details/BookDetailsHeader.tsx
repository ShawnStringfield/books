import { type Book } from "@/app/stores/types";
import ReadingProgressBar from "../ReadingProgressBar";
import { calculatePercentComplete } from "@/app/utils/bookUtils";
import { BookHeader } from "./BookHeader";

interface BookDetailsHeaderProps {
  book: Required<Book>;
  showEditControls: boolean;
  showReadingControls: boolean;
  showHighlightForm: boolean;
  onReadingControlsClick: () => void;
  onHighlightClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onCancelEdit: () => void;
  onSaveChanges: () => void;
}

export function BookDetailsHeader({
  book,
  showEditControls,
  showReadingControls,
  showHighlightForm,
  onReadingControlsClick,
  onHighlightClick,
  onEditClick,
  onDeleteClick,
  onCancelEdit,
  onSaveChanges,
}: BookDetailsHeaderProps) {
  return (
    <>
      <ReadingProgressBar
        currentPage={book.currentPage || 0}
        totalPages={book.totalPages || 0}
        progress={calculatePercentComplete(book.currentPage, book.totalPages)}
        variant="bleed"
        className="relative -mt-[1px] bg-white overflow-visible"
      />
      <BookHeader
        book={book}
        showEditControls={showEditControls}
        showReadingControls={showReadingControls}
        showHighlightForm={showHighlightForm}
        onReadingControlsClick={onReadingControlsClick}
        onHighlightClick={onHighlightClick}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        onCancelEdit={onCancelEdit}
        onSaveChanges={onSaveChanges}
      />
    </>
  );
}
