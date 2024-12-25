import { type Book } from "@/app/stores/types";
import ReadingControls from "../ReadingControls";

interface ReadingControlsSectionProps {
  book: Required<Book>;
  isLastBook: boolean;
  manualTotalPages: string;
  onStatusChange: (status: "not-started" | "in-progress" | "completed") => void;
  onProgressChange: (value: number) => void;
  onCancel: () => void;
  onManualTotalPagesChange: (value: string) => void;
  onTotalPagesUpdate: (value: number) => void;
  isUpdating?: boolean;
  error?: Error | null;
}

export function ReadingControlsSection({
  book,
  isLastBook,
  manualTotalPages,
  onStatusChange,
  onProgressChange,
  onCancel,
  onManualTotalPagesChange,
  onTotalPagesUpdate,
  isUpdating,
  error,
}: ReadingControlsSectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6 border">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reading Controls</h2>
        {isUpdating && (
          <div className="text-sm text-gray-500">Saving changes...</div>
        )}
        {error && (
          <div className="text-sm text-red-500">
            Failed to save changes. Please try again.
          </div>
        )}
      </div>

      <ReadingControls
        bookId={book.id}
        currentPage={book.currentPage || 0}
        totalPages={book.totalPages || 0}
        status={book.status}
        uniqueId={book.id}
        variant="mobile"
        onStatusChange={(bookId: string, status) => onStatusChange(status)}
        onProgressChange={(value: number[]) => onProgressChange(value[0])}
        onCancel={onCancel}
        isLastBook={isLastBook}
        manualTotalPages={manualTotalPages}
        onManualTotalPagesChange={onManualTotalPagesChange}
        onTotalPagesUpdate={onTotalPagesUpdate}
        fromGoogle={book.fromGoogle || false}
      />
    </div>
  );
}
