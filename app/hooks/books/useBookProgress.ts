import {
  ReadingStatus,
  ReadingStatusType,
  type Book,
} from "@/app/stores/types";
import {
  useUpdateReadingProgress,
  useUpdateReadingStatus,
  useUpdateBook,
} from "./useBooks";
import { useBookStatus } from "@/app/hooks/books/useBookStatus";

interface UseBookProgressProps {
  book: Book;
  books?: Book[];
  onStatusChange?: (status: ReadingStatusType) => void;
  onProgressChange?: (currentPage: number) => void;
  onTotalPagesUpdate?: (totalPages: number) => void;
}

interface UseBookProgressReturn {
  handleProgressChange: (value: number[]) => Promise<void>;
  handleStatusChange: (
    bookId: string,
    status: ReadingStatusType
  ) => Promise<void>;
  handleTotalPagesUpdate: (value: number) => Promise<void>;
  isUpdating: boolean;
  error: Error | null;
}

export function useBookProgress({
  book,
  books = [],
  onStatusChange,
  onProgressChange,
  onTotalPagesUpdate,
}: UseBookProgressProps): UseBookProgressReturn {
  const updateProgressMutation = useUpdateReadingProgress();
  const updateStatusMutation = useUpdateReadingStatus();
  const updateBookMutation = useUpdateBook();
  const { changeBookStatus, isChangingStatus } = useBookStatus(
    books.map((b) => ({
      id: b.id!,
      title: b.title,
      status: b.status,
      currentPage: b.currentPage || 0,
      totalPages: b.totalPages || 0,
    }))
  );

  const handleProgressChange = async (value: number[]) => {
    const newPage = value[0];
    if (!book.id) return;

    try {
      // Update progress first
      await updateProgressMutation.mutateAsync({
        bookId: book.id,
        currentPage: newPage,
      });

      onProgressChange?.(newPage);

      // Automatically determine and update status based on the new page
      if (newPage === 0 && book.status !== ReadingStatus.NOT_STARTED) {
        // If at page 0, mark as not started
        await handleStatusChange(book.id, ReadingStatus.NOT_STARTED);
      } else if (
        newPage === book.totalPages &&
        book.status !== ReadingStatus.COMPLETED
      ) {
        // If at last page, mark as completed
        await handleStatusChange(book.id, ReadingStatus.COMPLETED);
      } else if (
        newPage > 0 &&
        newPage < book.totalPages &&
        (book.status === ReadingStatus.NOT_STARTED ||
          book.status === ReadingStatus.COMPLETED)
      ) {
        // If between pages and currently not started or completed, mark as in progress
        await handleStatusChange(book.id, ReadingStatus.IN_PROGRESS);
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
      throw error;
    }
  };

  const handleStatusChange = async (
    bookId: string,
    newStatus: ReadingStatusType
  ) => {
    if (isChangingStatus || !book.id) return;

    const bookForStatus = {
      id: book.id,
      title: book.title,
      status: book.status,
      currentPage: book.currentPage || 0,
      totalPages: book.totalPages || 0,
    };

    try {
      if (await changeBookStatus(bookForStatus, newStatus)) {
        await updateStatusMutation.mutateAsync({ bookId, status: newStatus });
        onStatusChange?.(newStatus);

        // Update progress based on status
        let newProgress = book.currentPage || 0;
        if (newStatus === ReadingStatus.NOT_STARTED) {
          newProgress = 0;
        } else if (newStatus === ReadingStatus.COMPLETED) {
          newProgress = book.totalPages || 0;
        }

        // Only update progress if it changed
        if (newProgress !== book.currentPage) {
          await updateProgressMutation.mutateAsync({
            bookId: book.id,
            currentPage: newProgress,
          });
          onProgressChange?.(newProgress);
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      throw error;
    }
  };

  const handleTotalPagesUpdate = async (value: number) => {
    if (value > 0 && book.id) {
      try {
        // Update total pages first
        await updateBookMutation.mutateAsync({
          bookId: book.id,
          updates: { totalPages: value },
        });

        onTotalPagesUpdate?.(value);

        // Then update the reading progress if needed
        const newCurrentPage = Math.min(book.currentPage || 0, value);
        if (newCurrentPage !== book.currentPage) {
          await updateProgressMutation.mutateAsync({
            bookId: book.id,
            currentPage: newCurrentPage,
          });
          onProgressChange?.(newCurrentPage);
        }
      } catch (error) {
        console.error("Failed to update book:", error);
        throw error;
      }
    }
  };

  const isUpdating =
    updateProgressMutation.isPending ||
    updateStatusMutation.isPending ||
    updateBookMutation.isPending ||
    isChangingStatus;

  const error =
    updateProgressMutation.error ||
    updateStatusMutation.error ||
    updateBookMutation.error ||
    null;

  return {
    handleProgressChange,
    handleStatusChange,
    handleTotalPagesUpdate,
    isUpdating,
    error,
  };
}
