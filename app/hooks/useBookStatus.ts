import { useState, useCallback } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { ReadingStatus, ReadingStatusType } from '@/app/stores/types';
import { useBookStore } from '@/app/stores/useBookStore';

interface Book {
  id: string;
  title: string;
  status: ReadingStatusType;
  currentPage: number;
  totalPages: number;
}

interface UseBookStatusResult {
  canChangeStatus: (book: Book, newStatus: ReadingStatusType) => boolean;
  changeBookStatus: (book: Book, newStatus: ReadingStatusType) => Promise<boolean>;
  isChangingStatus: boolean;
  error: Error | null;
}

export const useBookStatus = (books: Book[]): UseBookStatusResult => {
  const { toast } = useToast();
  const { updateReadingProgress } = useBookStore();
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const canChangeStatus = useCallback(
    (book: Book, newStatus: ReadingStatusType): boolean => {
      // Don't allow changing to the current status
      if (book.status === newStatus) {
        return false;
      }

      // Only restrict status change if this is the only book and moving FROM in_progress
      // TO anything except completed
      if (
        books.length === 1 &&
        book.status === ReadingStatus.IN_PROGRESS &&
        newStatus !== ReadingStatus.IN_PROGRESS &&
        newStatus !== ReadingStatus.COMPLETED
      ) {
        return false;
      }

      // Don't allow moving to 'not_started' if book was completed
      if (book.status === ReadingStatus.COMPLETED && newStatus === ReadingStatus.NOT_STARTED) {
        return false;
      }

      return true;
    },
    [books]
  );

  const changeBookStatus = useCallback(
    async (book: Book, newStatus: ReadingStatusType): Promise<boolean> => {
      if (!canChangeStatus(book, newStatus)) {
        toast({
          title: "Can't Change Book Status",
          description:
            books.length === 1
              ? "You can't change your only in-progress book to 'not started'. You can mark it as completed."
              : 'Invalid status transition',
          variant: 'destructive',
        });
        return false;
      }

      setIsChangingStatus(true);
      setError(null);

      try {
        // If marking as completed, update progress to total pages
        if (newStatus === ReadingStatus.COMPLETED && book.currentPage !== book.totalPages) {
          updateReadingProgress(book.id, book.totalPages);
        }

        // Add your API call here to update the book status
        // await updateBookStatus(book.id, newStatus);

        toast({
          title: 'Status Updated',
          description: `${book.title} has been moved to ${newStatus.replace('_', ' ')}`,
        });

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update book status');
        setError(error);

        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });

        return false;
      } finally {
        setIsChangingStatus(false);
      }
    },
    [canChangeStatus, toast, books.length, updateReadingProgress]
  );

  return {
    canChangeStatus,
    changeBookStatus,
    isChangingStatus,
    error,
  };
};
