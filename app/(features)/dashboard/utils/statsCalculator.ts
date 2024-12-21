import { Book, Highlight } from '../types/books';

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
 * Counts books completed in the current month
 */
const getBooksCompletedThisMonth = (books: Book[]): number => {
  return books.filter((book) => book.completedDate && new Date(book.completedDate).getMonth() === new Date().getMonth()).length;
};

/**
 * Counts books completed in the current year
 */
const getBooksCompletedThisYear = (books: Book[]): number => {
  return books.filter((book) => book.completedDate && new Date(book.completedDate).getFullYear() === new Date().getFullYear()).length;
};

/**
 * Counts highlights created in the current month
 */
const getHighlightsThisMonth = (highlights: Highlight[]): number => {
  return highlights.filter((highlight) => new Date(highlight.createdAt).getMonth() === new Date().getMonth()).length;
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
