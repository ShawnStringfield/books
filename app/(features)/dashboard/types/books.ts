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
  coverUrl?: string;
  totalPages: number;
  currentPage: number;
  startDate?: Date;
  completedDate: Date | null | undefined;
  status: ReadingStatus;
  highlights: Highlight[];
  description?: string;
  publisher?: string;
  previewLink?: string;
  infoLink?: string;
  categories?: string[];
}

export interface Highlight {
  id: string;
  bookId: string;
  text: string;
  page: number;
  isFavorite: boolean;
  createdAt: Date;
}

export interface BookHighlight {
  id: string;
  bookId: string;
  text: string;
  page: number;
  isFavorite?: boolean;
  createdAt: Date;
}

interface GoogleBookVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  pageCount?: number;
  imageLinks?: {
    thumbnail?: string;
  };
  description?: string;
  publisher?: string;
  previewLink?: string;
  infoLink?: string;
  categories?: string[];
}
