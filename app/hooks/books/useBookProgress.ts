import { useState } from "react";
import {
  type Book,
  type ReadingStatusType,
  ReadingStatus,
} from "@/app/stores/types";
import { useUpdateBook } from "./useBooks";
import { useQueryClient } from "@tanstack/react-query";

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

export function useBookProgress({
  id,
  currentPage,
  totalPages,
  status,
  onStatusChange,
  onProgressChange,
  onTotalPagesUpdate,
}: Pick<Book, "id" | "currentPage" | "totalPages" | "status"> & {
  id: string;
  onStatusChange?: (status: ReadingStatusType) => void;
  onProgressChange?: (currentPage: number) => void;
  onTotalPagesUpdate?: (totalPages: number) => void;
}): UseBookProgressReturn {
  const queryClient = useQueryClient();
  const updateBookMutation = useUpdateBook();
  const [showReadingControls, setShowReadingControls] = useState(false);
  const [showHighlightForm, setShowHighlightForm] = useState(false);
  const [manualTotalPages, setManualTotalPages] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);

  const handleProgressChange = async (newPage: number) => {
    try {
      if (!id || id === "") {
        console.error("Book ID is required");
        setError(new Error("Book ID is required"));
        return;
      }

      // Validate page numbers
      if (newPage < 0 || (totalPages && newPage > totalPages)) {
        console.error("Invalid page number");
        setError(new Error("Invalid page number"));
        return;
      }

      setError(null);

      // Determine status based on progress
      let newStatus: ReadingStatusType | undefined;
      if (newPage === 0 && status !== ReadingStatus.NOT_STARTED) {
        newStatus = ReadingStatus.NOT_STARTED;
      } else if (
        totalPages &&
        newPage === totalPages &&
        status !== ReadingStatus.COMPLETED
      ) {
        newStatus = ReadingStatus.COMPLETED;
      } else if (
        newPage > 0 &&
        newPage < totalPages &&
        (status === ReadingStatus.NOT_STARTED ||
          status === ReadingStatus.COMPLETED)
      ) {
        newStatus = ReadingStatus.IN_PROGRESS;
      }

      // Optimistically update the cache
      const currentBook = queryClient.getQueryData<Book>(["books", id]);
      if (currentBook) {
        queryClient.setQueryData(["books", id], {
          ...currentBook,
          currentPage: newPage,
          ...(newStatus && { status: newStatus }),
        });
      }

      // Update progress and status if needed
      await updateBookMutation.mutateAsync({
        bookId: id,
        updates: {
          currentPage: newPage,
          ...(newStatus && { status: newStatus }),
        },
      });

      // Call the callback functions if provided
      onProgressChange?.(newPage);
      if (newStatus) {
        onStatusChange?.(newStatus);
      }
    } catch (err) {
      // Revert optimistic update on error
      const currentBook = queryClient.getQueryData<Book>(["books", id]);
      if (currentBook) {
        queryClient.setQueryData(["books", id], currentBook);
      }
      const error =
        err instanceof Error ? err : new Error("Failed to update progress");
      console.error("Failed to update progress:", error);
      setError(error);
    }
  };

  const handleStatusChange = async (newStatus: ReadingStatusType) => {
    try {
      if (!id || id === "") {
        console.error("Book ID is required");
        setError(new Error("Book ID is required"));
        return;
      }

      if (!Object.values(ReadingStatus).includes(newStatus)) {
        console.error("Invalid reading status");
        setError(new Error("Invalid reading status"));
        return;
      }

      setError(null);

      // Determine appropriate page number based on status
      let newPage = currentPage ?? 0;
      if (newStatus === ReadingStatus.NOT_STARTED) {
        newPage = 0;
      } else if (newStatus === ReadingStatus.COMPLETED && totalPages) {
        newPage = totalPages;
      }

      // Optimistically update the cache
      const currentBook = queryClient.getQueryData<Book>(["books", id]);
      if (currentBook) {
        queryClient.setQueryData(["books", id], {
          ...currentBook,
          status: newStatus,
          currentPage: newPage,
        });
      }

      // Update both status and progress
      await updateBookMutation.mutateAsync({
        bookId: id,
        updates: {
          status: newStatus,
          currentPage: newPage,
        },
      });

      // Call the callback functions if provided
      onStatusChange?.(newStatus);
      onProgressChange?.(newPage);
    } catch (err) {
      // Revert optimistic update on error
      const currentBook = queryClient.getQueryData<Book>(["books", id]);
      if (currentBook) {
        queryClient.setQueryData(["books", id], currentBook);
      }
      const error =
        err instanceof Error ? err : new Error("Failed to update status");
      console.error("Failed to update status:", error);
      setError(error);
    }
  };

  const handleTotalPagesUpdate = async (newTotalPages: number) => {
    if (newTotalPages > 0) {
      try {
        if (!id || id === "") {
          console.error("Book ID is required");
          setError(new Error("Book ID is required"));
          return;
        }

        setError(null);

        // Adjust current page if it exceeds new total
        const newCurrentPage = Math.min(currentPage, newTotalPages);

        // Optimistically update the cache
        queryClient.setQueryData(["books", id], {
          ...{ id, currentPage, totalPages, status },
          totalPages: newTotalPages,
          currentPage: newCurrentPage,
        });

        await updateBookMutation.mutateAsync({
          bookId: id,
          updates: {
            totalPages: newTotalPages,
            currentPage: newCurrentPage,
          },
        });

        // Call the callback function if provided
        onTotalPagesUpdate?.(newTotalPages);
      } catch (err) {
        // Revert optimistic update on error
        queryClient.setQueryData(["books", id], {
          id,
          currentPage,
          totalPages,
          status,
        });
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to update total pages");
        console.error("Failed to update total pages:", error);
        setError(error);
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
    error,
    handleProgressChange,
    handleStatusChange,
    handleTotalPagesUpdate,
    toggleReadingControls,
    toggleHighlightForm,
    setManualTotalPages,
  };
}
