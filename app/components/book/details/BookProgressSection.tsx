import { type Book } from "@/app/stores/types";
import ReadingProgressBar from "../ReadingProgressBar";
import { calculatePercentComplete } from "@/app/lib/utils/bookUtils";

interface BookProgressSectionProps {
  book: Required<Book>;
}

export function BookProgressSection({ book }: BookProgressSectionProps) {
  return (
    <div className="space-y-4 py-8 border-t">
      <h2 className="text-lg font-semibold leading-tight">Reading Progress</h2>
      <ReadingProgressBar
        currentPage={book.currentPage || 0}
        totalPages={book.totalPages}
        progress={calculatePercentComplete(book.currentPage, book.totalPages)}
        variant="default"
      />
    </div>
  );
}
