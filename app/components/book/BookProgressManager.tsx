import { type Book, ReadingStatusType } from "@/app/stores/types";
import { useBookProgress } from "@/app/hooks/books/useBookProgress";
import { useBookControls } from "@/app/hooks/books/useBookControls";

interface BookProgressManagerProps {
  book: Book;
  books?: Book[];
  children: (props: {
    handleProgressChange: (value: number[]) => Promise<void>;
    handleStatusChange: (
      bookId: string,
      status: ReadingStatusType
    ) => Promise<void>;
    handleTotalPagesUpdate: (value: number) => Promise<void>;
    showReadingControls: boolean;
    showHighlightForm: boolean;
    manualTotalPages: string;
    showDeleteWarning: boolean;
    toggleReadingControls: () => void;
    toggleHighlightForm: () => void;
    setManualTotalPages: (value: string) => void;
    setShowDeleteWarning: (show: boolean) => void;
    resetControls: () => void;
    isUpdating: boolean;
    error: Error | null;
  }) => React.ReactNode;
  onStatusChange?: (status: ReadingStatusType) => void;
  onProgressChange?: (currentPage: number) => void;
  onTotalPagesUpdate?: (totalPages: number) => void;
}

export default function BookProgressManager({
  book,
  books,
  children,
  onStatusChange,
  onProgressChange,
  onTotalPagesUpdate,
}: BookProgressManagerProps) {
  const {
    handleProgressChange,
    handleStatusChange,
    handleTotalPagesUpdate,
    isUpdating,
    error,
  } = useBookProgress({
    book,
    books,
    onStatusChange,
    onProgressChange,
    onTotalPagesUpdate,
  });

  const {
    showReadingControls,
    showHighlightForm,
    manualTotalPages,
    showDeleteWarning,
    toggleReadingControls,
    toggleHighlightForm,
    setManualTotalPages,
    setShowDeleteWarning,
    resetControls,
  } = useBookControls();

  return children({
    handleProgressChange,
    handleStatusChange,
    handleTotalPagesUpdate,
    showReadingControls,
    showHighlightForm,
    manualTotalPages,
    showDeleteWarning,
    toggleReadingControls,
    toggleHighlightForm,
    setManualTotalPages,
    setShowDeleteWarning,
    resetControls,
    isUpdating,
    error,
  });
}
