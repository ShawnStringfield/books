export interface GoogleBook {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

export interface GoogleBooksResponse {
  items: GoogleBook[];
  totalItems: number;
}

export const ReadingStatus = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

export type ReadingStatusType = (typeof ReadingStatus)[keyof typeof ReadingStatus];

export interface BaseBook {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: ReadingStatusType;
  categories: string[];
  previewLink?: string;
  infoLink?: string;
  description?: string;
  genre?: string;
  isbn?: string;
  publisher?: string;
  language?: string;
  publishDate?: string;
  startDate?: string;
  coverUrl?: string;
  highlights?: Highlight[];
  completedDate?: string;
  fromGoogle?: boolean;
}

export interface BaseHighlight {
  id?: string;
  bookId: string;
  text: string;
  page: number;
  isFavorite: boolean;
  modifiedAt?: string;
}

export interface Book extends BaseBook {
  createdAt: string;
  updatedAt: string;
}

export interface Highlight extends BaseHighlight {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrichedHighlight extends Highlight {
  bookTitle: string;
  bookAuthor: string;
  bookCurrentPage: number;
  bookTotalPages: number;
  readingProgress: number;
}

export interface BookHighlight {
  id: string;
  bookId: string;
  text: string;
  page: number;
  note?: string;
  isFavorite: boolean;
  createdAt: string;
  modifiedAt?: string;
}

interface GoogleBookVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  pageCount?: number;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
  };
  description?: string;
  publisher?: string;
  previewLink?: string;
  infoLink?: string;
  categories?: string[];
  industryIdentifiers?: Array<{
    type: string;
    identifier: string;
  }>;
}
