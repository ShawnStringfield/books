import { useState } from "react";
import {
  type Book,
  type ReadingStatusType,
  ReadingStatus,
} from "@/app/stores/types";
import { useUpdateBook, useUpdateReadingStatus } from "./useBooks";
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
  const updateReadingStatusMutation = useUpdateReadingStatus();
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

      // Determine dates based on status change
      const now = new Date().toISOString();
      let startDate: string | undefined = undefined;
      let completedDate: string | undefined = undefined;

      // Get current book data and update cache
      const currentBook = queryClient.getQueryData<Book>(["books", id]);
      if (currentBook) {
        startDate = currentBook.startDate;
        completedDate = currentBook.completedDate;

        // Update dates based on status change
        if (
          newStatus === ReadingStatus.IN_PROGRESS &&
          status === ReadingStatus.NOT_STARTED
        ) {
          startDate = now;
        } else if (newStatus === ReadingStatus.NOT_STARTED) {
          startDate = undefined;
          completedDate = undefined;
        } else if (newStatus === ReadingStatus.COMPLETED) {
          completedDate = now;
        }

        // Optimistically update the cache
        queryClient.setQueryData(["books", id], {
          ...currentBook,
          currentPage: newPage,
          ...(newStatus && { status: newStatus }),
          startDate,
          completedDate,
        });
      }

      // Update progress
      await updateBookMutation.mutateAsync({
        bookId: id,
        updates: {
          currentPage: newPage,
        },
      });

      // If status needs to change, use updateReadingStatus
      if (newStatus) {
        await updateReadingStatusMutation.mutateAsync({
          bookId: id,
          status: newStatus,
        });
      }

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

      // Determine dates based on status change
      const now = new Date().toISOString();
      let startDate: string | undefined = undefined;
      let completedDate: string | undefined = undefined;

      // Get current book data
      const currentBook = queryClient.getQueryData<Book>(["books", id]);
      if (currentBook) {
        startDate = currentBook.startDate;
        completedDate = currentBook.completedDate;

        // Update dates based on status change
        if (
          newStatus === ReadingStatus.IN_PROGRESS &&
          status === ReadingStatus.NOT_STARTED
        ) {
          startDate = now;
        } else if (newStatus === ReadingStatus.NOT_STARTED) {
          startDate = undefined;
          completedDate = undefined;
        } else if (newStatus === ReadingStatus.COMPLETED) {
          completedDate = now;
        }

        // Optimistically update the cache
        queryClient.setQueryData(["books", id], {
          ...currentBook,
          status: newStatus,
          currentPage: newPage,
          startDate,
          completedDate,
        });
      }

      // First update the status using updateReadingStatus
      await updateReadingStatusMutation.mutateAsync({
        bookId: id,
        status: newStatus,
      });

      // Then update the page if needed
      if (newPage !== currentPage) {
        await updateBookMutation.mutateAsync({
          bookId: id,
          updates: {
            currentPage: newPage,
          },
        });
      }

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
