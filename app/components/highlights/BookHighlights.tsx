import AddHighlightForm from "./AddHighlightForm";
import HighlightsList from "./HighlightsList";
import { cn } from "@/app/lib/utils";

interface BookHighlightsProps {
  bookId: string;
  currentPage: number;
  showForm: boolean;
  onClose: () => void;
  highlightLimit?: number;
  className?: string;
}

const BookHighlights = ({
  bookId,
  currentPage,
  showForm,
  onClose,
  highlightLimit,
  className,
}: BookHighlightsProps) => {
  return (
    <div className={cn("space-y-8", className)}>
      {showForm && (
        <AddHighlightForm
          bookId={bookId}
          currentPage={currentPage}
          onClose={onClose}
        />
      )}
      {!showForm && <HighlightsList bookId={bookId} limit={highlightLimit} />}
    </div>
  );
};

export default BookHighlights;
