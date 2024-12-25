import { useState } from "react";
import {
  type Book,
  type ReadingStatusType,
  ReadingStatus,
} from "@/app/stores/types";
import { useUpdateBook } from "./useBooks";

interface UseBookProgressReturn {
  showReadingControls: boolean;
  showHighlightForm: boolean;
  manualTotalPages: string;
  isUpdating: boolean;
  error: Error | null;
  handleProgressChange: (newPage: number) => void;
  handleStatusChange: (newStatus: ReadingStatusType) => void;
  handleTotalPagesUpdate: (newTotalPages: number) => void;
  toggleReadingControls: () => void;
  toggleHighlightForm: () => void;
  setManualTotalPages: (value: string) => void;
}

export function useBookProgress(book: Required<Book>): UseBookProgressReturn {
  const updateBookMutation = useUpdateBook();
  const [showReadingControls, setShowReadingControls] = useState(false);
  const [showHighlightForm, setShowHighlightForm] = useState(false);
  const [manualTotalPages, setManualTotalPages] = useState<string>("");

  const handleProgressChange = async (newPage: number) => {
    try {
      // Determine new status based on progress
      let newStatus: ReadingStatusType | undefined;

      if (newPage === 0 && book.status !== ReadingStatus.NOT_STARTED) {
        newStatus = ReadingStatus.NOT_STARTED;
      } else if (
        newPage === book.totalPages &&
        book.status !== ReadingStatus.COMPLETED
      ) {
        newStatus = ReadingStatus.COMPLETED;
      } else if (
        newPage > 0 &&
        newPage < book.totalPages &&
        (book.status === ReadingStatus.NOT_STARTED ||
          book.status === ReadingStatus.COMPLETED)
      ) {
        newStatus = ReadingStatus.IN_PROGRESS;
      }

      // Update progress and status if needed
      await updateBookMutation.mutateAsync({
        bookId: book.id,
        updates: {
          currentPage: newPage,
          ...(newStatus && { status: newStatus }),
        },
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  const handleStatusChange = async (newStatus: ReadingStatusType) => {
    try {
      // Determine appropriate page number based on status
      let newPage = book.currentPage;
      if (newStatus === ReadingStatus.NOT_STARTED) {
        newPage = 0;
      } else if (newStatus === ReadingStatus.COMPLETED) {
        newPage = book.totalPages;
      }

      // Update both status and progress
      await updateBookMutation.mutateAsync({
        bookId: book.id,
        updates: {
          status: newStatus,
          currentPage: newPage,
        },
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleTotalPagesUpdate = async (newTotalPages: number) => {
    if (newTotalPages > 0) {
      try {
        // Adjust current page if it exceeds new total
        const newCurrentPage = Math.min(book.currentPage, newTotalPages);

        await updateBookMutation.mutateAsync({
          bookId: book.id,
          updates: {
            totalPages: newTotalPages,
            currentPage: newCurrentPage,
          },
        });
      } catch (error) {
        console.error("Failed to update total pages:", error);
      }
    }
  };

  const toggleReadingControls = () => setShowReadingControls((prev) => !prev);
  const toggleHighlightForm = () => setShowHighlightForm((prev) => !prev);

  return {
    showReadingControls,
    showHighlightForm,
    manualTotalPages,
    isUpdating: updateBookMutation.isPending,
    error: updateBookMutation.error,
    handleProgressChange,
    handleStatusChange,
    handleTotalPagesUpdate,
    toggleReadingControls,
    toggleHighlightForm,
    setManualTotalPages,
  };
}
