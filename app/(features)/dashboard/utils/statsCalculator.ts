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
