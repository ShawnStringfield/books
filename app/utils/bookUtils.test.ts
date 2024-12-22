import { Book, ReadingStatus } from '@/app/stores/types';
import { calculateReadingStats, calculatePercentComplete } from './bookUtils';

describe('bookUtils', () => {
  // Use a fixed date for testing
  const NOW = new Date('2024-01-15T12:00:00Z');

  beforeEach(() => {
    // Mock the Date object
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    // Restore the Date object
    jest.useRealTimers();
  });

  // Mock data for reuse across tests
  const standardMockBooks: Book[] = [
    {
      id: '1',
      title: 'Book 1',
      author: 'Author 1',
      totalPages: 100,
      currentPage: 50,
      status: ReadingStatus.COMPLETED,
      categories: ['Fiction'],
      completedDate: '2024-01-15T12:00:00Z', // Current month (January 2024)
    },
    {
      id: '2',
      title: 'Book 2',
      author: 'Author 2',
      totalPages: 200,
      currentPage: 200,
      status: ReadingStatus.COMPLETED,
      categories: ['Non-fiction'],
      completedDate: '2023-12-15T12:00:00Z', // Previous month (December 2023)
    },
    {
      id: '3',
      title: 'Book 3',
      author: 'Author 3',
      totalPages: 300,
      currentPage: 150,
      status: ReadingStatus.IN_PROGRESS,
      categories: ['Science'],
      completedDate: '2023-01-15T12:00:00Z', // Previous year (January 2023)
    },
  ];

  describe('calculateReadingStats', () => {
    beforeEach(() => {
      // Set a fixed date for all tests
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should count books completed this year correctly', () => {
      const books: Book[] = [
        {
          id: '1',
          title: 'Book 1',
          author: 'Author 1',
          totalPages: 100,
          currentPage: 100,
          status: ReadingStatus.COMPLETED,
          categories: ['Fiction'],
          completedDate: '2024-01-01T00:00:00Z', // This year
        },
        {
          id: '2',
          title: 'Book 2',
          author: 'Author 2',
          totalPages: 100,
          currentPage: 100,
          status: ReadingStatus.COMPLETED,
          categories: ['Fiction'],
          completedDate: '2023-12-31T23:59:59Z', // Last year
        },
      ];

      const stats = calculateReadingStats(books);
      expect(stats.booksCompletedThisYear).toBe(1);
    });

    it('should count books completed this month correctly', () => {
      const books: Book[] = [
        {
          id: '1',
          title: 'Book 1',
          author: 'Author 1',
          totalPages: 100,
          currentPage: 100,
          status: ReadingStatus.COMPLETED,
          categories: ['Fiction'],
          completedDate: '2024-01-01T00:00:00Z', // This month
        },
        {
          id: '2',
          title: 'Book 2',
          author: 'Author 2',
          totalPages: 100,
          currentPage: 100,
          status: ReadingStatus.COMPLETED,
          categories: ['Fiction'],
          completedDate: '2023-12-31T23:59:59Z', // Last month
        },
      ];

      const stats = calculateReadingStats(books);
      expect(stats.booksCompletedThisMonth).toBe(1);
    });

    describe('with standard data', () => {
      it('should calculate correct stats for the current month and year', () => {
        const stats = calculateReadingStats(standardMockBooks);

        expect(stats.booksCompletedThisMonth).toBe(1);
        expect(stats.booksCompletedThisYear).toBe(1);
      });
    });

    describe('edge cases', () => {
      beforeEach(() => {
        // Set the system time to January 15, 2024
        jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
      });

      it('should handle same-day transitions correctly', () => {
        const booksAtMonthTransition: Book[] = [
          {
            id: '1',
            title: 'Book at day end',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2024-01-15T23:59:59Z', // Same day as NOW, but end of day
          },
          {
            id: '2',
            title: 'Book at day start',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2024-01-15T00:00:00Z', // Same day as NOW, but start of day
          },
        ];

        const stats = calculateReadingStats(booksAtMonthTransition);
        expect(stats.booksCompletedThisMonth).toBe(2);
      });

      it('should handle month boundaries correctly', () => {
        // Temporarily set the system time to February 1st
        jest.setSystemTime(new Date('2024-02-01T12:00:00Z'));

        const booksAtMonthBoundary: Book[] = [
          {
            id: '1',
            title: 'Book completed at end of January',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2024-01-31T23:59:59Z',
          },
          {
            id: '2',
            title: 'Book completed at start of February',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2024-02-01T00:00:00Z',
          },
        ];

        const stats = calculateReadingStats(booksAtMonthBoundary);
        expect(stats.booksCompletedThisMonth).toBe(1); // Should only count the February book
      });

      it('should handle month transitions correctly', () => {
        const booksAtMonthTransition: Book[] = [
          {
            id: '1',
            title: 'Book at month end',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2024-01-15T23:59:59Z', // Same day as NOW, but end of day
          },
          {
            id: '2',
            title: 'Book at month start',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2024-01-15T00:00:00Z', // Same day as NOW, but start of day
          },
        ];

        const stats = calculateReadingStats(booksAtMonthTransition);
        expect(stats.booksCompletedThisMonth).toBe(2);
      });

      it('should handle year transitions correctly', () => {
        // Set the system time to January 15, 2024 to test year transition
        jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));

        const booksAtYearTransition: Book[] = [
          {
            id: '1',
            title: 'Book at year end',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2023-12-31T23:59:59Z', // Last year
          },
          {
            id: '2',
            title: 'Book at year start',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2024-01-01T00:00:00Z', // This year
          },
        ];

        // Debug information
        const stats = calculateReadingStats(booksAtYearTransition);
        console.log('Current system time:', new Date().toISOString());
        console.log(
          'Books:',
          booksAtYearTransition.map((book) => ({
            title: book.title,
            completedDate: book.completedDate,
            year: book.completedDate ? new Date(book.completedDate).getFullYear() : 'undefined',
          }))
        );
        console.log('Stats:', stats);

        // Test both year and month stats
        expect(stats.booksCompletedThisYear).toBe(1); // Only the 2024 book
        expect(stats.booksCompletedThisMonth).toBe(1); // The January 2024 book
      });

      it('should handle invalid dates correctly', () => {
        const booksWithInvalidDates: Book[] = [
          {
            id: '1',
            title: 'Book with invalid date',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: 'invalid-date',
          },
        ];

        const stats = calculateReadingStats(booksWithInvalidDates);
        expect(stats.booksCompletedThisMonth).toBe(0);
        expect(stats.booksCompletedThisYear).toBe(0);
      });

      it('should handle timezone edge cases', () => {
        // Test with UTC dates and local timezone dates
        const booksWithTimezones: Book[] = [
          {
            id: '1',
            title: 'Book with UTC date',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2024-01-15T00:00:00Z', // UTC midnight
          },
          {
            id: '2',
            title: 'Book with UTC date near day boundary',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: '2024-01-15T23:59:59Z', // UTC end of day
          },
        ];

        const stats = calculateReadingStats(booksWithTimezones);
        expect(stats.booksCompletedThisMonth).toBe(2);
      });
    });

    describe('data validation', () => {
      it('should handle null/undefined completedDate', () => {
        const booksWithNullDates: Book[] = [
          {
            id: '1',
            title: 'Book with null date',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
            completedDate: undefined,
          },
          {
            id: '2',
            title: 'Book with undefined date',
            author: 'Author',
            totalPages: 100,
            currentPage: 100,
            status: ReadingStatus.COMPLETED,
            categories: ['Fiction'],
          },
        ];

        const stats = calculateReadingStats(booksWithNullDates);
        expect(stats.booksCompletedThisMonth).toBe(0);
        expect(stats.booksCompletedThisYear).toBe(0);
      });
    });

    it('should return zero stats when no books exist', () => {
      const stats = calculateReadingStats([]);
      expect(stats.booksCompletedThisMonth).toBe(0);
      expect(stats.booksCompletedThisYear).toBe(0);
    });
  });

  describe('calculatePercentComplete', () => {
    it('should calculate correct percentage for valid inputs', () => {
      expect(calculatePercentComplete(50, 100)).toBe(50);
      expect(calculatePercentComplete(100, 100)).toBe(100);
      expect(calculatePercentComplete(25, 100)).toBe(25);
    });

    it('should handle edge cases', () => {
      // Null/undefined inputs
      expect(calculatePercentComplete(null, 100)).toBe(0);
      expect(calculatePercentComplete(undefined, 100)).toBe(0);
      expect(calculatePercentComplete(50, null)).toBe(0);
      expect(calculatePercentComplete(50, undefined)).toBe(0);

      // Invalid inputs
      expect(calculatePercentComplete(-10, 100)).toBe(0);
      expect(calculatePercentComplete(150, 100)).toBe(100);
      expect(calculatePercentComplete(50, 0)).toBe(0);
      expect(calculatePercentComplete(50, -100)).toBe(0);
    });

    it('should round percentages to nearest integer', () => {
      expect(calculatePercentComplete(33, 100)).toBe(33);
      expect(calculatePercentComplete(66, 100)).toBe(66);
      expect(calculatePercentComplete(1, 3)).toBe(33); // 33.33... should round to 33
    });
  });
});
