import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Book, Highlight, ReadingStatus, ReadingStatusType, EnrichedHighlight } from './types';
export type { Book, Highlight, ReadingStatusType, GoogleBook, GoogleBooksResponse, EnrichedHighlight } from './types';
import { v4 as uuidv4 } from 'uuid';
import { enrichHighlights, filterHighlights } from '@/app/utils/highlightUtils';
import { getCurrentISODate } from '@/app/utils/dateUtils';
import { canChangeBookStatus } from '@/app/utils/bookStatusUtils';
import {
  sortHighlights,
  getRecentHighlightsData,
  getHighlightsByBook,
  getFavoriteHighlightsByBook,
  getFavoriteHighlights,
  getHighlightsThisMonth,
  HighlightSortOption,
} from '@/app/utils/highlightUtils';

interface HighlightFilters {
  bookId?: string;
  favorite?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Utility function to handle book status and dates
const getUpdatedBookStatus = (
  currentStatus: ReadingStatusType,
  currentPage: number,
  totalPages: number,
  existingStartDate?: string,
  existingCompletedDate?: string
) => {
  let status = currentStatus;
  let startDate = existingStartDate;
  let completedDate = existingCompletedDate;

  if (currentPage === 0) {
    status = ReadingStatus.NOT_STARTED;
    startDate = undefined;
    completedDate = undefined;
  } else if (currentPage === totalPages) {
    status = ReadingStatus.COMPLETED;
    startDate = startDate || getCurrentISODate();
    completedDate = getCurrentISODate();
  } else if (currentPage > 0) {
    status = ReadingStatus.IN_PROGRESS;
    startDate = startDate || getCurrentISODate();
    completedDate = undefined;
  }

  return { status, startDate, completedDate };
};

interface BookState {
  books: Book[];
  highlights: Highlight[];
  currentBook: Book | null;
  currentStatus: ReadingStatusType;
  isLoading: boolean;
  error: string | null;
  isAddBookSheetOpen: boolean;
  hasHydrated: boolean;
}

interface BookActions {
  addBook: (book: Book) => void;
  addHighlight: (bookId: string, highlight: Omit<Highlight, 'id' | 'bookId' | 'createdAt'>) => void;
  toggleFavoriteHighlight: (id: string) => void;
  updateHighlight: (id: string, text: string) => void;
  updateReadingProgress: (bookId: string, currentPage: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAddBookSheetOpen: (isOpen: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  updateBookStatus: (bookId: string, status: ReadingStatusType) => void;
  updateBookDescription: (bookId: string, description: string) => void;
  updateBookGenre: (bookId: string, genre: string) => void;
  updateTotalPages: (bookId: string, totalPages: number) => void;
  deleteBook: (bookId: string) => void;
  deleteHighlight: (highlightId: string) => void;
  filterHighlights: (filters: HighlightFilters) => Highlight[];
}

export type BookStore = BookState & BookActions;

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      // Initial state
      books: [],
      highlights: [],
      currentBook: null,
      currentStatus: ReadingStatus.NOT_STARTED,
      isLoading: false,
      error: null,
      isAddBookSheetOpen: false,
      hasHydrated: false,

      // Actions
      addBook: (book) =>
        set((state) => {
          const isFirstBook = state.books.length === 0;
          const status = book.status || (isFirstBook ? ReadingStatus.IN_PROGRESS : ReadingStatus.NOT_STARTED);
          const startDate = book.startDate || (isFirstBook ? getCurrentISODate() : undefined);
          const currentPage = book.currentPage ?? (isFirstBook ? 1 : 0);
          const categories = book.categories || [];

          return {
            books: [
              ...state.books,
              {
                ...book,
                description: book?.description || '',
                status,
                currentPage,
                startDate,
                categories,
                genre: categories[0] || 'Unknown',
                fromGoogle: book.fromGoogle ?? false,
              },
            ],
            error: null,
            isAddBookSheetOpen: false,
          };
        }),

      addHighlight: (bookId, highlight) =>
        set((state) => {
          const newHighlight: Highlight = {
            id: uuidv4(),
            bookId,
            ...highlight,
            createdAt: getCurrentISODate(),
            isFavorite: false,
          };

          return {
            highlights: [newHighlight, ...state.highlights],
          };
        }),

      toggleFavoriteHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h)),
        })),

      updateHighlight: (id, text) =>
        set((state) => ({
          highlights: state.highlights.map((h) =>
            h.id === id
              ? {
                  ...h,
                  text,
                  modifiedAt: getCurrentISODate(),
                }
              : h
          ),
        })),

      updateReadingProgress: (bookId, currentPage) =>
        set((state) => {
          const book = state.books.find((b) => b.id === bookId);
          if (!book) return state;

          const { status, startDate, completedDate } = getUpdatedBookStatus(
            book.status,
            currentPage,
            book.totalPages,
            book.startDate,
            book.completedDate
          );

          return {
            books: state.books.map((b) =>
              b.id === bookId
                ? {
                    ...b,
                    currentPage,
                    status,
                    startDate,
                    completedDate,
                  }
                : b
            ),
          };
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setAddBookSheetOpen: (isOpen) => set({ isAddBookSheetOpen: isOpen }),

      setHasHydrated: (state) => set({ hasHydrated: state }),

      updateBookStatus: (bookId, status) =>
        set((state) => {
          const book = state.books.find((b) => b.id === bookId);
          if (!book) return state;

          const isOnlyBook = state.books.length === 1;
          const statusChange = canChangeBookStatus({ book, newStatus: status, isOnlyBook });

          if (!statusChange.allowed) {
            return state;
          }

          const currentPage = status === ReadingStatus.COMPLETED ? book.totalPages : status === ReadingStatus.NOT_STARTED ? 0 : book.currentPage;

          const { startDate, completedDate } = getUpdatedBookStatus(status, currentPage, book.totalPages, book.startDate, book.completedDate);

          return {
            books: state.books.map((b) =>
              b.id === bookId
                ? {
                    ...b,
                    status,
                    currentPage,
                    completedDate,
                    startDate,
                  }
                : b
            ),
          };
        }),

      updateBookDescription: (bookId, description) =>
        set((state) => ({
          books: state.books.map((b) =>
            b.id === bookId
              ? {
                  ...b,
                  description,
                }
              : b
          ),
        })),

      updateBookGenre: (bookId, genre) =>
        set((state) => ({
          books: state.books.map((b) =>
            b.id === bookId
              ? {
                  ...b,
                  genre,
                }
              : b
          ),
        })),

      updateTotalPages: (bookId, totalPages) =>
        set((state) => {
          const book = state.books.find((b) => b.id === bookId);
          if (!book) return state;

          // Ensure current page doesn't exceed new total pages
          const newCurrentPage = Math.min(book.currentPage || 0, totalPages);

          return {
            books: state.books.map((b) =>
              b.id === bookId
                ? {
                    ...b,
                    totalPages,
                    currentPage: newCurrentPage,
                    // If this was a Google book, mark it as manually edited
                    fromGoogle: false,
                  }
                : b
            ),
          };
        }),

      deleteBook: (bookId) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== bookId),
          highlights: state.highlights.filter((h) => h.bookId !== bookId),
        }));
      },

      deleteHighlight: (highlightId: string) =>
        set((state) => ({
          highlights: state.highlights.filter((h) => h.id !== highlightId),
        })),

      filterHighlights: (filters: HighlightFilters) => {
        const state = get();
        return filterHighlights(state.highlights, filters);
      },
    }),
    {
      name: 'book-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

// Types
// Base selectors
export const selectBooks = (state: BookStore): Book[] => state.books;
export const selectHighlights = (state: BookStore): Highlight[] => state.highlights;

// Memoized selectors using Zustand's built-in memoization
let cachedEnrichedHighlights: EnrichedHighlight[] | null = null;
let lastBooksRef: Book[] | null = null;
let lastHighlightsRef: Highlight[] | null = null;

export const selectEnrichedHighlights = (state: BookStore): EnrichedHighlight[] => {
  const books = selectBooks(state);
  const highlights = selectHighlights(state);

  // Check if we need to recompute
  if (cachedEnrichedHighlights === null || books !== lastBooksRef || highlights !== lastHighlightsRef) {
    lastBooksRef = books;
    lastHighlightsRef = highlights;
    cachedEnrichedHighlights = enrichHighlights(highlights, books).sort((a, b) => {
      const dateA = new Date(a.modifiedAt || a.createdAt).getTime();
      const dateB = new Date(b.modifiedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }

  return cachedEnrichedHighlights;
};

// Cache for recent highlights data
let cachedRecentHighlightsData: {
  recentHighlights: EnrichedHighlight[];
  totalHighlights: number;
  highlightsThisMonth: number;
} | null = null;
let lastEnrichedHighlightsRef: EnrichedHighlight[] | null = null;
let lastLimit: number | null = null;

// Combined selector for recent highlights data
export const selectRecentHighlightsData = (
  state: BookStore,
  limit: number = 5
): {
  recentHighlights: EnrichedHighlight[];
  totalHighlights: number;
  highlightsThisMonth: number;
} => {
  const enrichedHighlights = selectEnrichedHighlights(state);

  // Check if we need to recompute
  if (cachedRecentHighlightsData === null || enrichedHighlights !== lastEnrichedHighlightsRef || limit !== lastLimit) {
    lastEnrichedHighlightsRef = enrichedHighlights;
    lastLimit = limit;
    cachedRecentHighlightsData = getRecentHighlightsData(enrichedHighlights, limit);
  }

  return cachedRecentHighlightsData;
};

// Enhanced selectors for better performance
export const selectRecentHighlights = (state: BookStore) => selectEnrichedHighlights(state).slice(0, 5);
export const selectFavoriteHighlights = (state: BookStore) => getFavoriteHighlights(selectEnrichedHighlights(state));
export const selectHighlightsByBook = (bookId: string) => (state: BookStore) => getHighlightsByBook(selectEnrichedHighlights(state), bookId);
export const selectTotalHighlights = (state: BookStore) => selectEnrichedHighlights(state).length;
export const selectHighlightsThisMonth = (state: BookStore) => getHighlightsThisMonth(selectEnrichedHighlights(state));

// Memoization cache for sorted highlights
let sortedHighlightsCache: {
  highlights: EnrichedHighlight[];
  sortBy: HighlightSortOption;
} | null = null;
let sortedHighlightsRef: EnrichedHighlight[] | null = null;
let sortedOptionRef: HighlightSortOption | null = null;

export const selectSortedHighlights =
  (sortBy: HighlightSortOption) =>
  (state: BookStore): EnrichedHighlight[] => {
    const enrichedHighlights = selectEnrichedHighlights(state);

    // Check if we can use cached results
    if (sortedHighlightsCache !== null && enrichedHighlights === sortedHighlightsRef && sortBy === sortedOptionRef) {
      return sortedHighlightsCache.highlights;
    }

    // Update cache references
    sortedHighlightsRef = enrichedHighlights;
    sortedOptionRef = sortBy;

    const sortedHighlights = sortHighlights(enrichedHighlights, sortBy);

    // Update cache
    sortedHighlightsCache = {
      highlights: sortedHighlights,
      sortBy,
    };

    return sortedHighlights;
  };

export const selectIsLoading = (state: BookStore) => state.isLoading;
export const selectError = (state: BookStore) => state.error;
export const selectHasHydrated = (state: BookStore) => state.hasHydrated;
export const selectCurrentlyReading = (state: BookStore) => state.books.filter((book) => book.status === ReadingStatus.IN_PROGRESS);
export const selectFirstCurrentlyReading = (state: BookStore) => state.books.find((book) => book.status === ReadingStatus.IN_PROGRESS);
export const selectIsLastBook = (state: BookStore) => state.books.length === 1;

export const selectRecentHighlightsByBook = (bookId: string, limit?: number) => (state: BookStore) =>
  getHighlightsByBook(selectEnrichedHighlights(state), bookId, limit);

export const selectFavoriteHighlightsByBook = (bookId: string) => (state: BookStore) =>
  getFavoriteHighlightsByBook(selectEnrichedHighlights(state), bookId);

export const sortBooksByCompletionDate = (books: Book[]): Book[] => {
  return [...books].sort((a, b) => {
    const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
    const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
    return dateB - dateA;
  });
};
