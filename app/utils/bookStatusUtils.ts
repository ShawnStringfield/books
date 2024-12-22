import { ReadingStatus, ReadingStatusType } from '@/app/stores/types';

interface Book {
  id: string;
  status: ReadingStatusType;
  currentPage?: number;
  totalPages?: number;
}

interface ValidateStatusChangeParams {
  book: Book;
  newStatus: ReadingStatusType;
  isOnlyBook?: boolean;
}

export function canChangeBookStatus({ book, newStatus, isOnlyBook = false }: ValidateStatusChangeParams): {
  allowed: boolean;
  reason?: string;
} {
  // Don't allow changing to the current status
  if (book.status === newStatus) {
    return {
      allowed: false,
      reason: 'Book is already in this status',
    };
  }

  // Prevent changing from COMPLETED to NOT_STARTED
  if (book.status === ReadingStatus.COMPLETED && newStatus === ReadingStatus.NOT_STARTED) {
    return {
      allowed: false,
      reason: 'Cannot change a completed book back to not started',
    };
  }

  // Only allow NOT_STARTED if current status is IN_PROGRESS
  if (newStatus === ReadingStatus.NOT_STARTED && book.status !== ReadingStatus.IN_PROGRESS) {
    return {
      allowed: false,
      reason: 'Can only move to not started from in progress',
    };
  }

  // Only restrict status change if this is the only book and moving FROM in_progress
  // TO anything except completed
  if (isOnlyBook && book.status === ReadingStatus.IN_PROGRESS && newStatus !== ReadingStatus.IN_PROGRESS && newStatus !== ReadingStatus.COMPLETED) {
    return {
      allowed: false,
      reason: 'Cannot change status of the only book in progress except to completed',
    };
  }

  return { allowed: true };
}
