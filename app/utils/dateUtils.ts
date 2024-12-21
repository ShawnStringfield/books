import { format, formatDistanceToNow } from 'date-fns';

/**
 * Safely creates a UTC Date object from a string or Date
 * @returns Date object or null if invalid
 */
export const safeDate = (dateInput: string | Date | undefined | null): Date | null => {
  if (!dateInput) return null;
  try {
    const date = new Date(dateInput);
    // Ensure we're working with UTC
    const utcDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())
    );
    return isNaN(utcDate.getTime()) ? null : utcDate;
  } catch {
    return null;
  }
};

/**
 * Formats a date in a relative format (e.g., "2 hours ago")
 */
export const formatRelativeDate = (dateInput: string | Date) => {
  const date = new Date(dateInput);
  return {
    formatted: formatDistanceToNow(date, { addSuffix: true }),
    iso: date.toISOString(),
  };
};

/**
 * Formats a date in a long format (e.g., "April 1, 2024")
 */
export const formatLongDate = (dateInput: string | Date) => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return format(date, 'PPP');
};

/**
 * Checks if a date is in the current month and year
 */
export const isCurrentMonth = (dateInput: string | Date): boolean => {
  const date = new Date(dateInput);
  const now = new Date();
  return date.getUTCMonth() === now.getUTCMonth() && date.getUTCFullYear() === now.getUTCFullYear();
};

/**
 * Checks if a date is in the current year
 */
export const isCurrentYear = (dateInput: string | Date): boolean => {
  const date = new Date(dateInput);
  const now = new Date();
  return date.getUTCFullYear() === now.getUTCFullYear();
};

/**
 * Gets the current date in ISO format
 */
export const getCurrentISODate = (): string => {
  return new Date().toISOString();
};
