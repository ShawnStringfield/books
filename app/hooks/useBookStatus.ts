import { useState, useCallback } from 'react';
import { useToast } from '@/app/hooks/use-toast';
import { ReadingStatus } from '@/app/(features)/dashboard/types/books';

interface Book {
  id: string;
  title: string;
  status: ReadingStatus;
}

interface UseBookStatusResult {
  canChangeStatus: (book: Book, newStatus: ReadingStatus) => boolean;
  changeBookStatus: (book: Book, newStatus: ReadingStatus) => Promise<boolean>;
  isChangingStatus: boolean;
  error: Error | null;
}

export const useBookStatus = (books: Book[]): UseBookStatusResult => {
  const { toast } = useToast();
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const canChangeStatus = useCallback(
    (book: Book, newStatus: ReadingStatus): boolean => {
      // Don't allow status change if this is the only book and it's in progress
      if (books.length === 1 && book.status === ReadingStatus.IN_PROGRESS && newStatus !== ReadingStatus.IN_PROGRESS) {
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
    async (book: Book, newStatus: ReadingStatus): Promise<boolean> => {
      if (!canChangeStatus(book, newStatus)) {
        toast({
          title: "Can't Change Book Status",
          description: books.length === 1 ? 'You need to add another book before changing the status of your only book' : 'Invalid status transition',
          variant: 'destructive',
        });
        return false;
      }

      setIsChangingStatus(true);
      setError(null);

      try {
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
    [canChangeStatus, toast, books.length]
  );

  return {
    canChangeStatus,
    changeBookStatus,
    isChangingStatus,
    error,
  };
};
