/**
 * Cleans a book description by:
 * 1. Removing surrounding quotes
 * 2. Removing "Back Cover" text and its variations
 * 3. Normalizing whitespace
 * @param description - The book description to clean
 * @returns The cleaned description
 */
export const cleanDescription = (description: string): string => {
  return description
    .replace(/["'"']([^"'"']+)["'"']/g, '$1') // Remove quotes
    .replace(/[-–—]{1,2}\s*back\s*cover.*$/gi, '') // Remove all variations of "--Back Cover" text
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

/**
 * Converts a string to title case (first letter of each word capitalized)
 * Handles strings with underscores, hyphens, and multiple words
 * @param text - The text to convert to title case
 * @returns The text in title case format
 */
export const toTitleCase = (text: string): string => {
  // First replace underscores and hyphens with spaces
  const normalized = text.replace(/[_-]/g, ' ');
  // Split into words, capitalize each first letter, and join back
  return normalized
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
