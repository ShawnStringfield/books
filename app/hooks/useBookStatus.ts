import { useState, useCallback } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { ReadingStatus, ReadingStatusType } from '@/app/stores/types';
import { useBookStore } from '@/app/stores/useBookStore';
import { canChangeBookStatus } from '@/app/utils/bookStatusUtils';

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
      const isOnlyBook = books.length === 1;
      const statusChange = canChangeBookStatus({ book, newStatus, isOnlyBook });
      return statusChange.allowed;
    },
    [books]
  );

  const changeBookStatus = useCallback(
    async (book: Book, newStatus: ReadingStatusType): Promise<boolean> => {
      const isOnlyBook = books.length === 1;
      const statusChange = canChangeBookStatus({ book, newStatus, isOnlyBook });

      if (!statusChange.allowed) {
        toast({
          title: "Can't Change Book Status",
          description: statusChange.reason || 'Invalid status transition',
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
    [toast, books.length, updateReadingProgress]
  );

  return {
    canChangeStatus,
    changeBookStatus,
    isChangingStatus,
    error,
  };
};
