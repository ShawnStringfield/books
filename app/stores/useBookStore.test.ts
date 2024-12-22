import { renderHook, act, waitFor } from '@testing-library/react';
import { useBookStore, selectEnrichedHighlights, selectRecentHighlightsData, selectSortedHighlights, type EnrichedHighlight } from './useBookStore';
import { ReadingStatus } from '@/app/stores/types';

describe('useBookStore', () => {
  beforeEach(() => {
    useBookStore.setState({
      books: [],
      highlights: [],
      isLoading: false,
      error: null,
    });
  });

  it('should add a book', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.addBook({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        currentPage: 0,
        totalPages: 100,
        completedDate: undefined,
        status: ReadingStatus.NOT_STARTED,
        highlights: [],
        categories: [],
      });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe('Test Book');
  });

  it('should update reading progress', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.addBook({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        currentPage: 0,
        totalPages: 100,
        completedDate: undefined,
        status: ReadingStatus.NOT_STARTED,
        highlights: [],
        categories: [],
      });
    });

    act(() => {
      result.current.updateReadingProgress('1', 50);
    });

    expect(result.current.books[0].currentPage).toBe(50);
    expect(result.current.books[0].status).toBe(ReadingStatus.IN_PROGRESS);
  });

  it('should mark book as completed when reaching total pages', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.addBook({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        currentPage: 0,
        totalPages: 100,
        completedDate: undefined,
        status: ReadingStatus.NOT_STARTED,
        highlights: [],
        categories: [],
      });
    });

    act(() => {
      result.current.updateReadingProgress('1', 100);
    });

    expect(result.current.books[0].status).toBe(ReadingStatus.COMPLETED);
    expect(result.current.books[0].completedDate).toBeDefined();
  });

  it('should add and manage highlights', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.addBook({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        currentPage: 0,
        totalPages: 100,
        completedDate: undefined,
        status: ReadingStatus.NOT_STARTED,
        highlights: [],
        categories: [],
      });
    });

    act(() => {
      result.current.addHighlight('1', {
        text: 'Test highlight',
        page: 50,
        isFavorite: false,
      });
    });

    expect(result.current.highlights).toHaveLength(1);
    expect(result.current.highlights[0].text).toBe('Test highlight');

    const highlightId = result.current.highlights[0].id;

    act(() => {
      result.current.toggleFavoriteHighlight(highlightId);
    });

    expect(result.current.highlights[0].isFavorite).toBe(true);

    act(() => {
      result.current.deleteHighlight(highlightId);
    });

    expect(result.current.highlights).toHaveLength(0);
  });

  it('should delete book and its associated highlights', () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.addBook({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        currentPage: 0,
        totalPages: 100,
        completedDate: undefined,
        status: ReadingStatus.NOT_STARTED,
        highlights: [],
        categories: [],
      });
    });

    act(() => {
      result.current.addHighlight('1', {
        text: 'Test highlight',
        page: 50,
        isFavorite: false,
      });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.highlights).toHaveLength(1);

    act(() => {
      result.current.deleteBook('1');
    });

    expect(result.current.books).toHaveLength(0);
    expect(result.current.highlights).toHaveLength(0);
  });

  it('should update book description and genre', async () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.addBook({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        currentPage: 0,
        totalPages: 100,
        completedDate: undefined,
        status: ReadingStatus.NOT_STARTED,
        highlights: [],
        categories: [],
      });
    });

    act(() => {
      result.current.updateBookDescription('1', 'New description');
    });
    await waitFor(() => {
      expect(result.current.books[0].description).toBe('New description');
    });

    act(() => {
      result.current.updateBookGenre('1', 'Fiction');
    });
    await waitFor(() => {
      expect(result.current.books[0].genre).toBe('Fiction');
    });
  });

  it('should handle loading and error states', async () => {
    const { result } = renderHook(() => useBookStore());

    act(() => {
      result.current.setLoading(true);
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    act(() => {
      result.current.setError('Test error');
    });
    await waitFor(() => {
      expect(result.current.error).toBe('Test error');
    });

    act(() => {
      result.current.setLoading(false);
    });
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('highlight selectors and filters', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useBookStore());

      act(() => {
        // Reset the store
        useBookStore.setState({
          books: [],
          highlights: [],
          isLoading: false,
          error: null,
        });
      });

      // Add two books
      act(() => {
        result.current.addBook({
          id: '1',
          title: 'Book One',
          author: 'Author One',
          currentPage: 0,
          totalPages: 100,
          completedDate: undefined,
          status: ReadingStatus.IN_PROGRESS,
          highlights: [],
          categories: ['Fiction'],
        });

        result.current.addBook({
          id: '2',
          title: 'Book Two',
          author: 'Author Two',
          currentPage: 0,
          totalPages: 200,
          completedDate: undefined,
          status: ReadingStatus.IN_PROGRESS,
          highlights: [],
          categories: ['Non-Fiction'],
        });
      });

      // Add all highlights in a single act
      act(() => {
        result.current.addHighlight('1', {
          text: 'First highlight from book one',
          page: 10,
          isFavorite: false,
        });

        result.current.addHighlight('1', {
          text: 'Second highlight from book one',
          page: 20,
          isFavorite: false,
        });

        result.current.addHighlight('2', {
          text: 'First highlight from book two',
          page: 30,
          isFavorite: false,
        });

        result.current.addHighlight('2', {
          text: 'Second highlight from book two',
          page: 40,
          isFavorite: false,
        });
      });

      // Toggle two highlights as favorites
      act(() => {
        const highlights = result.current.highlights;
        result.current.toggleFavoriteHighlight(highlights[0].id); // First highlight from book one
        result.current.toggleFavoriteHighlight(highlights[2].id); // First highlight from book two
      });
    });

    it('should get all highlights across books', () => {
      const { result } = renderHook(() => useBookStore());
      act(() => {
        expect(result.current.highlights).toHaveLength(4);
      });
    });

    it('should get highlights for a specific book', () => {
      const { result } = renderHook(() => useBookStore());
      act(() => {
        const bookOneHighlights = result.current.filterHighlights({ bookId: '1' });
        expect(bookOneHighlights).toHaveLength(2);
        expect(bookOneHighlights[0].bookId).toBe('1');
        expect(bookOneHighlights[1].bookId).toBe('1');
      });
    });

    it('should get favorite highlights across all books', () => {
      const { result } = renderHook(() => useBookStore());
      act(() => {
        const favoriteHighlights = result.current.filterHighlights({ favorite: true });
        expect(favoriteHighlights).toHaveLength(2);
        expect(favoriteHighlights.every((h) => h.isFavorite)).toBe(true);
      });
    });

    it('should get favorite highlights for a specific book', () => {
      const { result } = renderHook(() => useBookStore());
      act(() => {
        const bookOneFavorites = result.current.filterHighlights({
          bookId: '1',
          favorite: true,
        });
        expect(bookOneFavorites).toHaveLength(1);
        expect(bookOneFavorites[0].bookId).toBe('1');
        expect(bookOneFavorites[0].isFavorite).toBe(true);
      });
    });

    it('should get highlights by date range', () => {
      const { result } = renderHook(() => useBookStore());
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      act(() => {
        const recentHighlights = result.current.filterHighlights({
          dateRange: {
            start: yesterday,
            end: tomorrow,
          },
        });
        expect(recentHighlights).toHaveLength(4);
        recentHighlights.forEach((highlight) => {
          const highlightDate = new Date(highlight.createdAt);
          expect(highlightDate >= yesterday && highlightDate <= tomorrow).toBe(true);
        });
      });
    });

    it('should get enriched highlights with book information', () => {
      const { result } = renderHook(() => useBookStore());
      let enrichedHighlights: EnrichedHighlight[];
      act(() => {
        enrichedHighlights = selectEnrichedHighlights(result.current);
        expect(enrichedHighlights).toHaveLength(4);
        enrichedHighlights.forEach((highlight: EnrichedHighlight) => {
          expect(highlight).toHaveProperty('bookTitle');
          expect(highlight).toHaveProperty('bookAuthor');
        });
      });
    });

    it('should get recent highlights with correct limit', () => {
      const { result } = renderHook(() => useBookStore());
      let recentHighlightsData: ReturnType<typeof selectRecentHighlightsData>;
      act(() => {
        recentHighlightsData = selectRecentHighlightsData(result.current, 5);
        expect(recentHighlightsData.recentHighlights).toHaveLength(4); // All highlights since we only have 4
        expect(recentHighlightsData.totalHighlights).toBe(4);
        expect(recentHighlightsData.highlightsThisMonth).toBe(4);
      });
    });

    it('should sort highlights by various criteria', () => {
      const { result } = renderHook(() => useBookStore());
      let sortedByDate: EnrichedHighlight[];

      act(() => {
        sortedByDate = selectSortedHighlights('date')(result.current);
        expect(sortedByDate).toHaveLength(4);
        for (let i = 1; i < sortedByDate.length; i++) {
          const prev = new Date(sortedByDate[i - 1].createdAt).getTime();
          const curr = new Date(sortedByDate[i].createdAt).getTime();
          expect(prev >= curr).toBe(true);
        }
      });
    });
  });
});
