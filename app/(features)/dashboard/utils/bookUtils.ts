import { Book, ReadingStatus } from '../types/books';

interface ReadingStats {
  booksCompletedThisMonth: number;
  booksCompletedThisYear: number;
}

/**
 * Filter books by reading status
 */
export const filterBooksByStatus = (books: Book[], status: ReadingStatus): Book[] => {
  return books.filter((book) => book.status === status);
};

/**
 * Get currently reading books
 */
export const getCurrentlyReadingBooks = (books: Book[]): Book[] => {
  return filterBooksByStatus(books, ReadingStatus.IN_PROGRESS);
};

/**
 * Get completed books
 */
export const getCompletedBooks = (books: Book[]): Book[] => {
  return filterBooksByStatus(books, ReadingStatus.COMPLETED);
};

/**
 * Get not started books
 */
export const getNotStartedBooks = (books: Book[]): Book[] => {
  return filterBooksByStatus(books, ReadingStatus.NOT_STARTED);
};

/**
 * Calculates reading statistics for the dashboard
 */
export const calculateReadingStats = (books: Book[]): ReadingStats => {
  return {
    booksCompletedThisMonth: getBooksCompletedThisMonth(books),
    booksCompletedThisYear: getBooksCompletedThisYear(books),
  };
};

/**
 * Safely creates a Date object from a string
 * @returns Date object or null if invalid
 */
const safeDate = (dateString: string | undefined | null): Date | null => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    // Ensure we're working with UTC
    const utcDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
    );
    return isNaN(utcDate.getTime()) ? null : utcDate;
  } catch {
    return null;
  }
};

/**
 * Counts books completed in the current year
 */
const getBooksCompletedThisYear = (books: Book[]): number => {
  const now = new Date();
  const currentYear = now.getUTCFullYear();

  return getCompletedBooks(books).filter((book) => {
    const completedDate = safeDate(book.completedDate);
    return completedDate?.getUTCFullYear() === currentYear;
  }).length;
};

/**
 * Counts books completed in the current month
 */
const getBooksCompletedThisMonth = (books: Book[]): number => {
  const now = new Date();
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();

  return getCompletedBooks(books).filter((book) => {
    const completedDate = safeDate(book.completedDate);
    return completedDate?.getUTCMonth() === currentMonth && completedDate?.getUTCFullYear() === currentYear;
  }).length;
};

/**
 * Calculates the percentage complete of a book
 * @param currentPage - Current page number (can be null/undefined)
 * @param totalPages - Total pages in the book (can be null/undefined)
 * @returns number between 0 and 100
 */
export const calculatePercentComplete = (currentPage: number | null | undefined, totalPages: number | null | undefined): number => {
  const current = currentPage ?? 0;
  const total = totalPages ?? 0;

  if (!total || total <= 0) return 0;
  if (current < 0) return 0;
  if (current > total) return 100;

  return Math.min(Math.round((current / total) * 100), 100);
};

/**
 * Sort books by completion date (newest first)
 */
export const sortBooksByCompletionDate = (books: Book[]): Book[] => {
  return [...books].sort((a, b) => {
    const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
    const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
    return dateB - dateA;
  });
};

/**
 * Sort books by start date (newest first)
 */
export const sortBooksByStartDate = (books: Book[]): Book[] => {
  return [...books].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateB - dateA;
  });
};

/**
 * Sort books by title
 */
export const sortBooksByTitle = (books: Book[]): Book[] => {
  return [...books].sort((a, b) => a.title.localeCompare(b.title));
};

/**
 * Sort books by author
 */
export const sortBooksByAuthor = (books: Book[]): Book[] => {
  return [...books].sort((a, b) => a.author.localeCompare(b.author));
};

/**
 * Sort books by reading progress
 */
export const sortBooksByProgress = (books: Book[]): Book[] => {
  return [...books].sort((a, b) => {
    const progressA = calculatePercentComplete(a.currentPage, a.totalPages);
    const progressB = calculatePercentComplete(b.currentPage, b.totalPages);
    return progressB - progressA;
  });
};
