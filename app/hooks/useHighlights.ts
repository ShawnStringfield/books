import { useCallback, useMemo, useEffect } from 'react';
import { create } from 'zustand';

// Types remain the same
interface Book {
  id: string;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  highlights?: BookHighlight[];
}

interface BookHighlight {
  id: string;
  text: string;
  page: number;
  bookId: string;
  createdAt: Date;
  isFavorite: boolean;
}

interface HighlightFilters {
  bookId?: string;
  favorite?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface HighlightStore {
  highlights: BookHighlight[];
  isLoading: boolean;
  error: Error | null;
  setHighlights: (highlights: BookHighlight[]) => void;
  addHighlight: (highlight: BookHighlight) => void;
  removeHighlight: (highlightId: string) => void;
  toggleFavorite: (highlightId: string) => void;
  setError: (error: Error | null) => void;
  setLoading: (isLoading: boolean) => void;
}

// Create store with properly memoized selectors
const useHighlightStore = create<HighlightStore>((set) => ({
  highlights: [],
  isLoading: false,
  error: null,
  setHighlights: (highlights) => set({ highlights }),
  addHighlight: (highlight) =>
    set((state) => ({
      highlights: [highlight, ...state.highlights],
    })),
  removeHighlight: (highlightId) =>
    set((state) => ({
      highlights: state.highlights.filter((h) => h.id !== highlightId),
    })),
  toggleFavorite: (highlightId) =>
    set((state) => ({
      highlights: state.highlights.map((h) => (h.id === highlightId ? { ...h, isFavorite: !h.isFavorite } : h)),
    })),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// Memoized selectors
const selectHighlights = (state: HighlightStore) => state.highlights;
const selectIsLoading = (state: HighlightStore) => state.isLoading;
const selectError = (state: HighlightStore) => state.error;

export const useBookHighlights = (books?: Book[]) => {
  // Use individual selectors to prevent unnecessary re-renders
  const highlights = useHighlightStore(selectHighlights);
  const isLoading = useHighlightStore(selectIsLoading);
  const error = useHighlightStore(selectError);

  const { setHighlights, addHighlight: addHighlightToStore, removeHighlight, toggleFavorite, setError, setLoading } = useHighlightStore();

  // Process books and combine highlights when books change
  useEffect(() => {
    if (!books) return;

    const processHighlights = async () => {
      try {
        setLoading(true);
        const combinedHighlights = books
          .filter((book) => book.highlights && Array.isArray(book.highlights))
          .flatMap((book) => {
            return (book.highlights || []).map((highlight) => ({
              ...highlight,
              createdAt: highlight.createdAt instanceof Date ? highlight.createdAt : new Date(highlight.createdAt),
              isFavorite: highlight.isFavorite ?? false,
              page: highlight.page ?? 0,
            }));
          })
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setHighlights(combinedHighlights);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to process highlights'));
      } finally {
        setLoading(false);
      }
    };

    processHighlights();
  }, [books, setHighlights, setError, setLoading]);

  // Memoized derived values
  const recentHighlights = useMemo(() => highlights.slice(0, 5), [highlights]);

  const favoriteHighlights = useMemo(() => highlights.filter((h) => h.isFavorite), [highlights]);

  const totalHighlights = useMemo(() => highlights.length, [highlights]);

  // Memoized callbacks
  const filterHighlights = useCallback(
    (filters: HighlightFilters) => {
      return highlights.filter((highlight) => {
        if (filters.bookId && highlight.bookId !== filters.bookId) return false;
        if (filters.favorite && !highlight.isFavorite) return false;
        if (filters.dateRange) {
          const { start, end } = filters.dateRange;
          const highlightDate = highlight.createdAt;
          if (highlightDate < start || highlightDate > end) return false;
        }
        return true;
      });
    },
    [highlights]
  );

  const getHighlightsByBook = useCallback((bookId: string) => highlights.filter((h) => h.bookId === bookId), [highlights]);

  const addHighlight = useCallback(
    (highlightData: Omit<BookHighlight, 'id' | 'createdAt'>) => {
      const newHighlight: BookHighlight = {
        ...highlightData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      addHighlightToStore(newHighlight);
    },
    [addHighlightToStore]
  );

  return {
    highlights,
    recentHighlights,
    favoriteHighlights,
    totalHighlights,
    isLoading,
    error,
    addHighlight,
    removeHighlight,
    toggleFavorite,
    filterHighlights,
    getHighlightsByBook,
  };
};
