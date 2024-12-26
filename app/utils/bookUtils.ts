import {
  Book,
  ReadingStatus,
  EnrichedHighlight,
  GoogleBookVolumeInfo,
} from "@/app/stores/types";
import { getHighlightsByBook } from "@/app/lib/utils/highlightUtils";
import { safeDate } from "@/app/utils/dateUtils";

export interface ReadingStats {
  totalBooks: number;
  booksInProgress: number;
  booksCompleted: number;
  totalPages: number;
  pagesRead: number;
  readingProgress: number;
}

/**
 * Checks if a book already exists in the library based on title and author
 * @param existingBooks - Array of existing books in the library
 * @param title - Title of the book to check
 * @param author - Author of the book to check
 * @returns boolean indicating if the book is a duplicate
 */
export const isDuplicateBook = (
  existingBooks: Book[],
  title: string,
  author: string
): boolean => {
  return existingBooks.some(
    (book) =>
      book.title.toLowerCase() === title.toLowerCase() &&
      book.author.toLowerCase() === author.toLowerCase()
  );
};

/**
 * Checks if a Google Book already exists in the library
 * @param existingBooks - Array of existing books in the library
 * @param volumeInfo - Google Books volume info
 * @returns boolean indicating if the book is a duplicate
 */
export const isDuplicateGoogleBook = (
  existingBooks: Book[],
  volumeInfo: GoogleBookVolumeInfo
): boolean => {
  return isDuplicateBook(
    existingBooks,
    volumeInfo.title,
    volumeInfo.authors?.[0] || "Unknown Author"
  );
};

/**
 * Gets sorted highlights for a specific book with optional limit
 */
export const getBookHighlightsSorted = (
  highlights: EnrichedHighlight[],
  bookId: string,
  limit?: number
) => {
  // getHighlightsByBook already includes sorting by date and filtering by bookId
  return getHighlightsByBook(highlights, bookId, limit);
};

/**
 * Calculates the percentage complete of a book
 * @param currentPage - Current page number (can be null/undefined)
 * @param totalPages - Total pages in the book (can be null/undefined)
 * @returns number between 0 and 100
 */
export const calculatePercentComplete = (
  currentPage: number | null | undefined,
  totalPages: number | null | undefined
): number => {
  const current = currentPage ?? 0;
  const total = totalPages ?? 0;

  if (!total || total <= 0) return 0;
  if (current < 0) return 0;
  if (current > total) return 100;

  return Math.min(Math.round((current / total) * 100), 100);
};

/**
 * Calculates reading statistics for completed books
 * @param books - Array of books to calculate stats for
 * @returns Object containing books completed this month and year
 */
export const calculateReadingStats = (books: Book[]) => {
  const now = safeDate(new Date().toISOString())!;
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();

  const completedBooks = books.filter((book) => {
    if (!book.completedDate || book.status !== ReadingStatus.COMPLETED) {
      return false;
    }

    const completedDate = safeDate(book.completedDate);
    if (!completedDate) {
      return false;
    }

    // Compare using UTC timestamps and ensure we're only comparing dates, not times
    const completedDateTime = Date.UTC(
      completedDate.getUTCFullYear(),
      completedDate.getUTCMonth(),
      completedDate.getUTCDate()
    );
    const nowDateTime = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );
    return completedDateTime <= nowDateTime;
  });

  const booksCompletedThisMonth = completedBooks.filter((book) => {
    const completedDate = safeDate(book.completedDate!);
    if (!completedDate) return false;
    // Compare only year and month, ignoring day and time
    return (
      completedDate.getUTCFullYear() === currentYear &&
      completedDate.getUTCMonth() === currentMonth
    );
  }).length;

  const booksCompletedThisYear = completedBooks.filter((book) => {
    const completedDate = safeDate(book.completedDate!);
    if (!completedDate) return false;
    // Compare only year
    return completedDate.getUTCFullYear() === currentYear;
  }).length;

  return {
    booksCompletedThisMonth,
    booksCompletedThisYear,
  };
};
