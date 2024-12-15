export interface GoogleBook {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
}

export interface GoogleBooksResponse {
  items: GoogleBook[];
  totalItems: number;
}

export enum ReadingStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: ReadingStatus;
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
}

export interface Highlight {
  id: string;
  bookId: string;
  text: string;
  page: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface BookHighlight {
  id: string;
  bookId: string;
  text: string;
  page: number;
  note?: string;
  isFavorite: boolean;
  createdAt: string;
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
