import { Book, Highlight } from '../types/books';
import { EnrichedHighlight } from '../stores/useBookStore';

/**
 * Enriches highlights with book data
 */
export const enrichHighlights = (highlights: Highlight[], books: Book[]): EnrichedHighlight[] => {
  const bookMap = new Map(
    books.map((book) => [
      book.id,
      {
        title: book.title,
        author: book.author,
        currentPage: book.currentPage,
        totalPages: book.totalPages,
      },
    ])
  );

  return highlights
    .map((highlight) => {
      const book = bookMap.get(highlight.bookId);
      if (!book) return null;

      return {
        ...highlight,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCurrentPage: book.currentPage,
        bookTotalPages: book.totalPages,
        readingProgress: Math.round((book.currentPage / book.totalPages) * 100),
      };
    })
    .filter((h): h is EnrichedHighlight => h !== null);
};

/**
 * Sorts highlights by date (newest first)
 */
export const sortHighlightsByDate = <T extends Highlight>(highlights: T[]): T[] => {
  return [...highlights].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

/**
 * Sorts highlights by book title and page number
 */
export const sortHighlightsByBook = (highlights: EnrichedHighlight[]): EnrichedHighlight[] => {
  return [...highlights].sort((a, b) => a.bookTitle.localeCompare(b.bookTitle) || a.page - b.page);
};

/**
 * Filters highlights for a specific book
 */
export const filterHighlightsByBook = <T extends Highlight>(highlights: T[], bookId: string): T[] => {
  return highlights.filter((h) => h.bookId === bookId);
};

/**
 * Filters highlights created in the current month
 */
export const filterHighlightsThisMonth = <T extends Highlight>(highlights: T[]): T[] => {
  const now = new Date();
  const currentMonth = now.getUTCMonth();
  const currentYear = now.getUTCFullYear();

  return highlights.filter((highlight) => {
    const createdDate = new Date(highlight.createdAt);
    return createdDate.getUTCMonth() === currentMonth && createdDate.getUTCFullYear() === currentYear;
  });
};

/**
 * Filters favorite highlights
 */
export const filterFavoriteHighlights = <T extends Highlight>(highlights: T[]): T[] => {
  return highlights.filter((h) => h.isFavorite);
};

/**
 * Gets highlights with pagination
 */
export const paginateHighlights = <T>(highlights: T[], page: number, pageSize: number): T[] => {
  const start = (page - 1) * pageSize;
  return highlights.slice(start, start + pageSize);
};

/**
 * Gets recent highlights with optional limit
 */
export const getRecentHighlights = <T extends Highlight>(highlights: T[], limit?: number): T[] => {
  const sorted = sortHighlightsByDate(highlights);
  return limit ? sorted.slice(0, limit) : sorted;
};

/**
 * Validates highlights against existing books
 */
export const validateHighlights = (highlights: Highlight[], books: Book[]): Highlight[] => {
  return highlights.filter((highlight) => books.some((book) => book.id === highlight.bookId));
};
