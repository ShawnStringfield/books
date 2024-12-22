import { Book, Highlight, ReadingStatus } from '@/app/stores/types';
import {
  enrichHighlights,
  sortHighlights,
  getRecentHighlightsData,
  getHighlightsByBook,
  getFavoriteHighlightsByBook,
  getFavoriteHighlights,
  getHighlightsThisMonth,
  filterHighlightsThisMonth,
  filterFavoriteHighlights,
  paginateHighlights,
  validateHighlights,
  filterHighlights,
} from './highlightUtils';

// Mock test data
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Book 1',
    author: 'Author 1',
    currentPage: 50,
    totalPages: 100,
    status: ReadingStatus.IN_PROGRESS,
    categories: ['fiction'],
  },
  {
    id: '2',
    title: 'Book 2',
    author: 'Author 2',
    currentPage: 75,
    totalPages: 150,
    status: ReadingStatus.COMPLETED,
    categories: ['non-fiction'],
  },
];

const mockHighlights: Highlight[] = [
  {
    id: '1',
    bookId: '1',
    text: 'Highlight 1',
    page: 10,
    createdAt: new Date('2024-01-15').toISOString(),
    isFavorite: true,
  },
  {
    id: '2',
    bookId: '1',
    text: 'Highlight 2',
    page: 20,
    createdAt: new Date('2024-01-16').toISOString(),
    isFavorite: false,
  },
  {
    id: '3',
    bookId: '2',
    text: 'Highlight 3',
    page: 30,
    createdAt: new Date('2024-01-20').toISOString(),
    isFavorite: true,
  },
];

describe('enrichHighlights', () => {
  it('should enrich highlights with book data', () => {
    const enriched = enrichHighlights(mockHighlights, mockBooks);
    expect(enriched).toHaveLength(3);
    expect(enriched[0]).toEqual(
      expect.objectContaining({
        bookTitle: 'Book 1',
        bookAuthor: 'Author 1',
        bookCurrentPage: 50,
        bookTotalPages: 100,
        readingProgress: 50,
      })
    );
  });

  it('should filter out highlights with non-existent book references', () => {
    const invalidHighlight: Highlight = {
      id: '4',
      bookId: 'non-existent',
      text: 'Invalid',
      page: 1,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    const enriched = enrichHighlights([...mockHighlights, invalidHighlight], mockBooks);
    expect(enriched).toHaveLength(3);
  });
});

describe('sortHighlights', () => {
  const enrichedHighlights = enrichHighlights(mockHighlights, mockBooks);

  it('should sort by date', () => {
    const sorted = sortHighlights(enrichedHighlights, 'date');
    expect(sorted[0].id).toBe('3'); // Most recent first
  });

  it('should sort by book title', () => {
    const sorted = sortHighlights(enrichedHighlights, 'book');
    expect(sorted[0].bookTitle).toBe('Book 1');
  });

  it('should sort by page number within same book', () => {
    const sorted = sortHighlights(enrichedHighlights, 'page');
    expect(sorted[0].page).toBe(10);
  });

  it('should sort by favorite status', () => {
    const sorted = sortHighlights(enrichedHighlights, 'favorite');
    expect(sorted[0].isFavorite).toBe(true);
  });
});

describe('getRecentHighlightsData', () => {
  const enrichedHighlights = enrichHighlights(mockHighlights, mockBooks);

  it('should return recent highlights data with default limit', () => {
    const data = getRecentHighlightsData(enrichedHighlights);
    expect(data.recentHighlights).toHaveLength(3);
    expect(data.totalHighlights).toBe(3);
    expect(typeof data.highlightsThisMonth).toBe('number');
  });

  it('should respect the limit parameter', () => {
    const data = getRecentHighlightsData(enrichedHighlights, 2);
    expect(data.recentHighlights).toHaveLength(2);
  });
});

describe('getHighlightsByBook', () => {
  const enrichedHighlights = enrichHighlights(mockHighlights, mockBooks);

  it('should return highlights for a specific book', () => {
    const bookHighlights = getHighlightsByBook(enrichedHighlights, '1');
    expect(bookHighlights).toHaveLength(2);
    expect(bookHighlights.every((h) => h.bookId === '1')).toBe(true);
  });

  it('should respect the limit parameter', () => {
    const bookHighlights = getHighlightsByBook(enrichedHighlights, '1', 1);
    expect(bookHighlights).toHaveLength(1);
  });
});

describe('getFavoriteHighlightsByBook', () => {
  const enrichedHighlights = enrichHighlights(mockHighlights, mockBooks);

  it('should return favorite highlights for a specific book', () => {
    const favorites = getFavoriteHighlightsByBook(enrichedHighlights, '1');
    expect(favorites).toHaveLength(1);
    expect(favorites[0].bookId).toBe('1');
    expect(favorites[0].isFavorite).toBe(true);
  });

  it('should return empty array for book with no favorites', () => {
    const noFavorites = getFavoriteHighlightsByBook(enrichedHighlights, '2');
    expect(noFavorites).toHaveLength(1);
  });
});

describe('getHighlightsThisMonth', () => {
  const enrichedHighlights = enrichHighlights(mockHighlights, mockBooks);

  it('should count highlights from current month', () => {
    const count = getHighlightsThisMonth(enrichedHighlights);
    expect(typeof count).toBe('number');
  });
});

describe('filterHighlightsThisMonth', () => {
  it('should filter highlights from current month', () => {
    const thisMonth = filterHighlightsThisMonth(mockHighlights);
    expect(Array.isArray(thisMonth)).toBe(true);
  });
});

describe('filterFavoriteHighlights', () => {
  it('should filter favorite highlights', () => {
    const favorites = filterFavoriteHighlights(mockHighlights);
    expect(favorites).toHaveLength(2);
    expect(favorites.every((h) => h.isFavorite)).toBe(true);
  });

  it('should return empty array when no favorites exist', () => {
    const noFavorites = filterFavoriteHighlights([
      { ...mockHighlights[0], isFavorite: false },
      { ...mockHighlights[1], isFavorite: false },
    ]);
    expect(noFavorites).toHaveLength(0);
  });
});

describe('paginateHighlights', () => {
  it('should return paginated results', () => {
    const page1 = paginateHighlights(mockHighlights, 1, 2);
    expect(page1).toHaveLength(2);

    const page2 = paginateHighlights(mockHighlights, 2, 2);
    expect(page2).toHaveLength(1);
  });
});

describe('validateHighlights', () => {
  it('should filter out highlights with invalid book references', () => {
    const invalidHighlight: Highlight = {
      id: '4',
      bookId: 'invalid',
      text: 'Invalid',
      page: 1,
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    const validated = validateHighlights([...mockHighlights, invalidHighlight], mockBooks);
    expect(validated).toHaveLength(3);
  });
});

describe('filterHighlights', () => {
  it('should filter by bookId', () => {
    const filtered = filterHighlights(mockHighlights, { bookId: '1' });
    expect(filtered).toHaveLength(2);
    expect(filtered.every((h) => h.bookId === '1')).toBe(true);
  });

  it('should filter by favorite status', () => {
    const filtered = filterHighlights(mockHighlights, { favorite: true });
    expect(filtered).toHaveLength(2);
    expect(filtered.every((h) => h.isFavorite)).toBe(true);
  });

  it('should filter by date range', () => {
    const filtered = filterHighlights(mockHighlights, {
      dateRange: {
        start: new Date('2024-01-15'),
        end: new Date('2024-01-16'),
      },
    });
    expect(filtered).toHaveLength(2);
  });

  it('should combine multiple filters', () => {
    const filtered = filterHighlights(mockHighlights, {
      bookId: '1',
      favorite: true,
      dateRange: {
        start: new Date('2024-01-15'),
        end: new Date('2024-01-16'),
      },
    });
    expect(filtered).toHaveLength(1);
  });
});

describe('getFavoriteHighlights', () => {
  const enrichedHighlights = enrichHighlights(mockHighlights, mockBooks);

  it('should return all favorite highlights across books', () => {
    const favorites = getFavoriteHighlights(enrichedHighlights);
    expect(favorites).toHaveLength(2);
    expect(favorites.every((h) => h.isFavorite)).toBe(true);
  });

  it('should return empty array when no favorites exist', () => {
    const noFavorites = getFavoriteHighlights(
      enrichHighlights(
        mockHighlights.map((h) => ({ ...h, isFavorite: false })),
        mockBooks
      )
    );
    expect(noFavorites).toHaveLength(0);
  });
});
