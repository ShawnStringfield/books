import { Book, ReadingStatus, EnrichedHighlight } from "@/app/stores/types";
import {
  calculateReadingStats,
  calculatePercentComplete,
  getBookHighlightsSorted,
} from "@/app/lib/utils/bookUtils";

describe("bookUtils", () => {
  const mockBooks: Book[] = [
    {
      id: "1",
      title: "Book 1",
      author: "Author 1",
      totalPages: 100,
      currentPage: 50,
      status: ReadingStatus.COMPLETED,
      categories: ["fiction"],
      completedDate: "2024-01-15T00:00:00Z",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "2",
      title: "Book 2",
      author: "Author 2",
      totalPages: 150,
      currentPage: 75,
      status: ReadingStatus.IN_PROGRESS,
      categories: ["non-fiction"],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
  ];

  describe("calculateReadingStats", () => {
    beforeEach(() => {
      // Set a fixed date for all tests
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should calculate correct stats for the current month and year", () => {
      const stats = calculateReadingStats(mockBooks);
      expect(stats.booksCompletedThisMonth).toBe(1);
      expect(stats.booksCompletedThisYear).toBe(1);
    });

    it("should handle books with no completedDate", () => {
      const booksWithNoDate: Book[] = [
        {
          id: "1",
          title: "No Date Book",
          author: "Author",
          totalPages: 100,
          currentPage: 100,
          status: ReadingStatus.COMPLETED,
          categories: ["fiction"],
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z",
        },
      ];

      const stats = calculateReadingStats(booksWithNoDate);
      expect(stats.booksCompletedThisYear).toBe(0);
      expect(stats.booksCompletedThisMonth).toBe(0);
    });

    it("should return zero stats when no books exist", () => {
      const stats = calculateReadingStats([]);
      expect(stats.booksCompletedThisMonth).toBe(0);
      expect(stats.booksCompletedThisYear).toBe(0);
    });
  });

  describe("calculatePercentComplete", () => {
    it("should calculate correct percentage for valid inputs", () => {
      expect(calculatePercentComplete(50, 100)).toBe(50);
      expect(calculatePercentComplete(100, 100)).toBe(100);
      expect(calculatePercentComplete(25, 100)).toBe(25);
    });

    it("should handle edge cases", () => {
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

    it("should round percentages to nearest integer", () => {
      expect(calculatePercentComplete(33, 100)).toBe(33);
      expect(calculatePercentComplete(66, 100)).toBe(66);
      expect(calculatePercentComplete(1, 3)).toBe(33); // 33.33... should round to 33
    });
  });

  describe("getBookHighlightsSorted", () => {
    const mockHighlights: EnrichedHighlight[] = [
      {
        id: "1",
        userId: "user1",
        bookId: "book1",
        text: "First highlight",
        page: 1,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
        isFavorite: false,
        bookTitle: "Test Book",
        bookAuthor: "Test Author",
        bookCurrentPage: 100,
        bookTotalPages: 200,
        readingProgress: 50,
      },
      {
        id: "2",
        userId: "user1",
        bookId: "book1",
        text: "Second highlight",
        page: 2,
        createdAt: "2024-01-15T11:00:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
        isFavorite: false,
        bookTitle: "Test Book",
        bookAuthor: "Test Author",
        bookCurrentPage: 100,
        bookTotalPages: 200,
        readingProgress: 50,
      },
      {
        id: "3",
        userId: "user1",
        bookId: "book2",
        text: "Different book highlight",
        page: 1,
        createdAt: "2024-01-15T12:00:00Z",
        updatedAt: "2024-01-15T12:00:00Z",
        isFavorite: false,
        bookTitle: "Another Book",
        bookAuthor: "Another Author",
        bookCurrentPage: 50,
        bookTotalPages: 100,
        readingProgress: 50,
      },
    ];

    it("should return sorted highlights for a book", () => {
      const result = getBookHighlightsSorted(mockHighlights, "book1");
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("2"); // Most recent first
      expect(result[1].id).toBe("1");
    });

    it("should respect the limit parameter", () => {
      const result = getBookHighlightsSorted(mockHighlights, "book1", 1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2"); // Most recent highlight
    });

    it("should return empty array for non-existent book", () => {
      const result = getBookHighlightsSorted(mockHighlights, "nonexistentId");
      expect(result).toEqual([]);
    });

    it("should handle empty highlights array", () => {
      const result = getBookHighlightsSorted([], "book1");
      expect(result).toEqual([]);
    });
  });
});
