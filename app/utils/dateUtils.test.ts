import { safeDate, formatRelativeDate, formatLongDate, isCurrentMonth, isCurrentYear, getCurrentISODate, isWithinDateRange } from './dateUtils';

describe('dateUtils', () => {
  // Mock current date for consistent testing
  const mockDate = new Date('2024-03-15T12:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('safeDate', () => {
    it('should handle valid date string', () => {
      const result = safeDate('2024-03-15T12:00:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe('2024-03-15T12:00:00.000Z');
    });

    it('should handle Date object', () => {
      const date = new Date('2024-03-15T12:00:00Z');
      const result = safeDate(date);
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe('2024-03-15T12:00:00.000Z');
    });

    it('should return null for invalid date string', () => {
      expect(safeDate('invalid-date')).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(safeDate(undefined)).toBeNull();
    });

    it('should return null for null input', () => {
      expect(safeDate(null)).toBeNull();
    });

    it('should return null when Date constructor throws', () => {
      // Mock Date constructor to throw an error
      const originalDate = global.Date;
      global.Date = jest.fn(() => {
        throw new Error('Date error');
      }) as unknown as DateConstructor;

      expect(safeDate('2024-03-15')).toBeNull();

      // Restore original Date constructor
      global.Date = originalDate;
    });
  });

  describe('formatRelativeDate', () => {
    it('should format date relative to now', () => {
      const pastDate = new Date('2024-03-14T12:00:00Z'); // 1 day ago
      const result = formatRelativeDate(pastDate);
      expect(result.formatted).toBe('1 day ago');
      expect(result.iso).toBe('2024-03-14T12:00:00.000Z');
    });

    it('should handle string input', () => {
      const result = formatRelativeDate('2024-03-14T12:00:00Z');
      expect(result.formatted).toBe('1 day ago');
      expect(result.iso).toBe('2024-03-14T12:00:00.000Z');
    });
  });

  describe('formatLongDate', () => {
    it('should format date in long format', () => {
      const date = new Date('2024-03-15T12:00:00Z');
      expect(formatLongDate(date)).toBe('March 15th, 2024');
    });

    it('should handle string input', () => {
      expect(formatLongDate('2024-03-15T12:00:00Z')).toBe('March 15th, 2024');
    });
  });

  describe('isCurrentMonth', () => {
    it('should return true for date in current month', () => {
      expect(isCurrentMonth('2024-03-01T12:00:00Z')).toBe(true);
    });

    it('should return false for date in different month', () => {
      expect(isCurrentMonth('2024-02-15T12:00:00Z')).toBe(false);
    });

    it('should return false for date in same month but different year', () => {
      expect(isCurrentMonth('2023-03-15T12:00:00Z')).toBe(false);
    });
  });

  describe('isCurrentYear', () => {
    it('should return true for date in current year', () => {
      expect(isCurrentYear('2024-01-01T12:00:00Z')).toBe(true);
    });

    it('should return false for date in different year', () => {
      expect(isCurrentYear('2023-12-31T12:00:00Z')).toBe(false);
    });
  });

  describe('getCurrentISODate', () => {
    it('should return current date in ISO format', () => {
      expect(getCurrentISODate()).toBe('2024-03-15T12:00:00.000Z');
    });
  });

  describe('isWithinDateRange', () => {
    const range = {
      start: new Date('2024-03-01T00:00:00Z'),
      end: new Date('2024-03-31T23:59:59Z'),
    };

    it('should return true for date within range', () => {
      expect(isWithinDateRange('2024-03-15T12:00:00Z', range)).toBe(true);
    });

    it('should return false for date before range', () => {
      expect(isWithinDateRange('2024-02-28T23:59:59Z', range)).toBe(false);
    });

    it('should return false for date after range', () => {
      expect(isWithinDateRange('2024-04-01T00:00:00Z', range)).toBe(false);
    });

    it('should return false for invalid date', () => {
      expect(isWithinDateRange('invalid-date', range)).toBe(false);
    });

    it('should handle Date object input', () => {
      const date = new Date('2024-03-15T12:00:00Z');
      expect(isWithinDateRange(date, range)).toBe(true);
    });
  });
});
