import { renderHook, act } from '@testing-library/react';
import { useDashboardStore } from './useDashboardStore';

describe('useDashboardStore', () => {
  beforeEach(() => {
    useDashboardStore.setState({
      books: [],
      highlights: [],
      isLoading: false,
      error: null,
    });
  });

  it('should add a book', () => {
    const { result } = renderHook(() => useDashboardStore());

    act(() => {
      result.current.addBook({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        currentPage: 0,
        totalPages: 100,
      });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe('Test Book');
  });

  it('should toggle highlight favorite status', () => {
    const { result } = renderHook(() => useDashboardStore());

    act(() => {
      result.current.addHighlight({
        id: '1',
        text: 'Test highlight',
        isFavorite: false,
        bookId: '1',
        page: 1,
        createdAt: new Date(),
      });
    });

    act(() => {
      result.current.toggleFavoriteHighlight('1');
    });

    expect(result.current.highlights[0].isFavorite).toBe(true);
  });

  it('should update reading progress', () => {
    const { result } = renderHook(() => useDashboardStore());

    act(() => {
      result.current.addBook({
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        currentPage: 0,
        totalPages: 100,
      });
    });

    act(() => {
      result.current.updateReadingProgress('1', 50);
    });

    expect(result.current.books[0].currentPage).toBe(50);
  });
});
