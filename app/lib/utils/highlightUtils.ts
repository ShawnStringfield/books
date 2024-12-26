import { Book, Highlight, EnrichedHighlight } from "@/app/stores/types";
import { isCurrentMonth, isWithinDateRange } from "@/app/lib/utils/dateUtils";

export type HighlightSortOption =
  | "date"
  | "book"
  | "page"
  | "length"
  | "favorite";

interface SortFunctions {
  [key: string]: (a: EnrichedHighlight, b: EnrichedHighlight) => number;
}

// Sort functions for different highlight sorting options
const sortFunctions: SortFunctions = {
  date: (a, b) => {
    const dateA = new Date(a.modifiedAt || a.createdAt).getTime();
    const dateB = new Date(b.modifiedAt || b.createdAt).getTime();
    return dateB - dateA;
  },
  book: (a, b) => a.bookTitle.localeCompare(b.bookTitle),
  page: (a, b) => {
    const bookCompare = a.bookTitle.localeCompare(b.bookTitle);
    return bookCompare !== 0 ? bookCompare : a.page - b.page;
  },
  length: (a, b) => b.text.length - a.text.length,
  favorite: (a, b) => {
    if (a.isFavorite === b.isFavorite) {
      const dateA = new Date(a.modifiedAt || a.createdAt).getTime();
      const dateB = new Date(b.modifiedAt || b.createdAt).getTime();
      return dateB - dateA;
    }
    return a.isFavorite ? -1 : 1;
  },
};

export const sortHighlights = (
  highlights: EnrichedHighlight[],
  sortBy: HighlightSortOption
): EnrichedHighlight[] => {
  const sortFn = sortFunctions[sortBy];
  return sortFn ? [...highlights].sort(sortFn) : highlights;
};

export const getRecentHighlightsData = (
  highlights: EnrichedHighlight[],
  limit: number = 5
): {
  recentHighlights: EnrichedHighlight[];
  totalHighlights: number;
  highlightsThisMonth: number;
} => {
  return {
    recentHighlights: highlights.slice(0, limit),
    totalHighlights: highlights.length,
    highlightsThisMonth: highlights.filter((h) => isCurrentMonth(h.createdAt))
      .length,
  };
};

export const getHighlightsByBook = (
  highlights: EnrichedHighlight[],
  bookId: string,
  limit?: number
): EnrichedHighlight[] => {
  if (!Array.isArray(highlights)) {
    return [];
  }

  const bookHighlights = highlights
    .filter((h) => h.bookId === bookId)
    .sort((a, b) => {
      const dateA = new Date(a.modifiedAt || a.createdAt).getTime();
      const dateB = new Date(b.modifiedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

  return limit ? bookHighlights.slice(0, limit) : bookHighlights;
};

export const getFavoriteHighlightsByBook = (
  highlights: EnrichedHighlight[],
  bookId: string
): EnrichedHighlight[] => {
  return highlights.filter((h) => h.bookId === bookId && h.isFavorite);
};

export const getFavoriteHighlights = (
  highlights: EnrichedHighlight[]
): EnrichedHighlight[] => {
  return highlights.filter((h) => h.isFavorite);
};

export const getHighlightsThisMonth = (
  highlights: EnrichedHighlight[]
): number => {
  return highlights.filter((h) => isCurrentMonth(h.createdAt)).length;
};

/**
 * Filters highlights created in the current month
 */
export const filterHighlightsThisMonth = <T extends Highlight>(
  highlights: T[]
): T[] => {
  return highlights.filter((highlight) => isCurrentMonth(highlight.createdAt));
};

/**
 * Filters favorite highlights
 */
export const filterFavoriteHighlights = <T extends Highlight>(
  highlights: T[]
): T[] => {
  return highlights.filter((h) => h.isFavorite);
};

/**
 * Gets highlights with pagination
 */
export const paginateHighlights = <T>(
  highlights: T[],
  page: number,
  pageSize: number
): T[] => {
  const start = (page - 1) * pageSize;
  return highlights.slice(start, start + pageSize);
};

/**
 * Validates highlights against existing books
 */
export const validateHighlights = (
  highlights: Highlight[],
  books: Book[]
): Highlight[] => {
  return highlights.filter((highlight) =>
    books.some((book) => book.id === highlight.bookId)
  );
};

/**
 * Filters highlights based on multiple criteria
 */
export const filterHighlights = <T extends Highlight>(
  highlights: T[],
  filters: {
    bookId?: string;
    favorite?: boolean;
    dateRange?: {
      start: Date;
      end: Date;
    };
  }
): T[] => {
  return highlights.filter((highlight) => {
    if (filters.bookId && highlight.bookId !== filters.bookId) return false;
    if (filters.favorite && !highlight.isFavorite) return false;
    if (
      filters.dateRange &&
      !isWithinDateRange(highlight.createdAt, filters.dateRange)
    )
      return false;
    return true;
  });
};

/**
 * Enriches highlights with book data
 */
export const enrichHighlights = (
  highlights: Highlight[],
  books: Book[]
): EnrichedHighlight[] => {
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
