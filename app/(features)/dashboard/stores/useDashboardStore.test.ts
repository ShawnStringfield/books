import { renderHook, act } from '@testing-library/react';
import { useDashboardStore } from './useDashboardStore';
import { ReadingStatus } from '../types/books';

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
        completedDate: null,
        status: ReadingStatus.NOT_STARTED,
        highlights: [],
      });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe('Test Book');
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
        completedDate: null,
        status: ReadingStatus.NOT_STARTED,
        highlights: [],
      });
    });

    act(() => {
      result.current.updateReadingProgress('1', 50);
    });

    expect(result.current.books[0].currentPage).toBe(50);
  });
});
