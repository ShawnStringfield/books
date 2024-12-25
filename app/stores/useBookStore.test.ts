import { renderHook, act } from '@testing-library/react';
import { useBookStore } from './useBookStore';
import { ReadingStatus, EnrichedHighlight } from '@/app/stores/types';
import { getRecentHighlightsData, sortHighlights } from '@/app/utils/highlightUtils';

describe('useBookStore', () => {
  describe('basic store operations', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useBookStore());
      expect(result.current.currentBook).toBeNull();
      expect(result.current.currentStatus).toBe(ReadingStatus.NOT_STARTED);
      expect(result.current.isAddBookSheetOpen).toBe(false);
      expect(result.current.hasHydrated).toBe(false);
    });

    it('should set current book', () => {
      const { result } = renderHook(() => useBookStore());
      act(() => {
        result.current.setCurrentBook({
          id: '1',
          title: 'Test Book',
          author: 'Test Author',
          totalPages: 100,
          currentPage: 0,
          status: ReadingStatus.NOT_STARTED,
          categories: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      expect(result.current.currentBook).toBeDefined();
      expect(result.current.currentBook?.title).toBe('Test Book');
    });

    it('should set current status', () => {
      const { result } = renderHook(() => useBookStore());
      act(() => {
        result.current.setCurrentStatus(ReadingStatus.IN_PROGRESS);
      });
      expect(result.current.currentStatus).toBe(ReadingStatus.IN_PROGRESS);
    });

    it('should toggle add book sheet', () => {
      const { result } = renderHook(() => useBookStore());
      act(() => {
        result.current.setAddBookSheetOpen(true);
      });
      expect(result.current.isAddBookSheetOpen).toBe(true);
    });
  });

  describe('highlight operations', () => {
    const mockHighlights: EnrichedHighlight[] = [
      {
        id: '1',
        userId: 'user1',
        bookId: 'book1',
        text: 'First highlight',
        page: 1,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        isFavorite: false,
        bookTitle: 'Test Book',
        bookAuthor: 'Test Author',
        bookCurrentPage: 100,
        bookTotalPages: 200,
        readingProgress: 50,
      },
      {
        id: '2',
        userId: 'user1',
        bookId: 'book1',
        text: 'Second highlight',
        page: 2,
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z',
        isFavorite: false,
        bookTitle: 'Test Book',
        bookAuthor: 'Test Author',
        bookCurrentPage: 100,
        bookTotalPages: 200,
        readingProgress: 50,
      },
    ];

    it('should get recent highlights with correct limit', () => {
      const recentHighlightsData = getRecentHighlightsData(mockHighlights, 5);
      expect(recentHighlightsData.recentHighlights).toHaveLength(2);
      expect(recentHighlightsData.totalHighlights).toBe(2);
      expect(recentHighlightsData.highlightsThisMonth).toBe(2);
    });

    it('should sort highlights by date', () => {
      const sortedByDate = sortHighlights(mockHighlights, 'date');
      expect(sortedByDate).toHaveLength(2);
      for (let i = 1; i < sortedByDate.length; i++) {
        const prev = new Date(sortedByDate[i - 1].createdAt).getTime();
        const curr = new Date(sortedByDate[i].createdAt).getTime();
        expect(prev >= curr).toBe(true);
      }
    });
  });
});
