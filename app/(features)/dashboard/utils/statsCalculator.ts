import { Book, Highlight, ReadingStatus } from '../types/books';

interface ReadingStats {
  booksCompletedThisMonth: number;
  booksCompletedThisYear: number;
  highlightsThisMonth: number;
}

/**
 * Calculates reading statistics for the dashboard
 */
export const calculateReadingStats = (books: Book[], highlights: Highlight[]): ReadingStats => {
  const validHighlights = getValidHighlights(highlights, books);

  return {
    booksCompletedThisMonth: getBooksCompletedThisMonth(books),
    booksCompletedThisYear: getBooksCompletedThisYear(books),
    highlightsThisMonth: getHighlightsThisMonth(validHighlights),
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
  console.log('Current year:', currentYear);

  return books.filter((book) => {
    const completedDate = safeDate(book.completedDate);
    console.log('Book:', book.title, 'Status:', book.status, 'Completed date:', book.completedDate, 'Year:', completedDate?.getUTCFullYear());
    const result = book.status === ReadingStatus.COMPLETED && completedDate?.getUTCFullYear() === currentYear;
    console.log('Is counted:', result);
    return result;
  }).length;
};

/**
 * Counts books completed in the current month
 */
const getBooksCompletedThisMonth = (books: Book[]): number => {
  const now = new Date();
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();

  return books.filter((book) => {
    const completedDate = safeDate(book.completedDate);
    return (
      book.status === ReadingStatus.COMPLETED && completedDate?.getUTCMonth() === currentMonth && completedDate?.getUTCFullYear() === currentYear
    );
  }).length;
};

/**
 * Counts highlights created in the current month
 */
const getHighlightsThisMonth = (highlights: Highlight[]): number => {
  const now = new Date();
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();

  return highlights.filter((highlight) => {
    const createdDate = safeDate(highlight.createdAt);
    return createdDate?.getUTCMonth() === currentMonth && createdDate?.getUTCFullYear() === currentYear;
  }).length;
};

/**
 * Filters highlights that belong to existing books
 */
export const getValidHighlights = (highlights: Highlight[], books: Book[]): Highlight[] => {
  return highlights.filter((highlight) => books.some((book) => book.id === highlight.bookId));
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
