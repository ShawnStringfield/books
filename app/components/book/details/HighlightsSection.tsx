import { type Book } from "@/app/stores/types";
import BookHighlights from "@/app/components/highlights/BookHighlights";

interface HighlightsSectionProps {
  book: Required<Book>;
  showForm: boolean;
  onClose: () => void;
}

export function HighlightsSection({
  book,
  showForm,
  onClose,
}: HighlightsSectionProps) {
  if (showForm) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <BookHighlights
          bookId={book.id}
          currentPage={book.currentPage || 0}
          showForm={true}
          onClose={onClose}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 py-8">
      <BookHighlights
        bookId={book.id}
        currentPage={book.currentPage || 0}
        showForm={false}
        onClose={onClose}
        className="space-y-4"
      />
    </div>
  );
}
