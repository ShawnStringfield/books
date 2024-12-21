import { renderHook, act } from '@testing-library/react';
import { useBookStore } from './useBookStore';
import { ReadingStatus } from '../types/books';

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
  });
});
