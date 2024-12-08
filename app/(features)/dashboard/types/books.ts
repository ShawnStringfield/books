export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    pageCount?: number;
    imageLinks?: {
      thumbnail?: string;
    };
  };
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
  author: string;
  coverUrl?: string;
  totalPages: number;
  currentPage: number;
  startDate?: Date;
  completedDate: Date | null | undefined;
  status: ReadingStatus;
}

export interface Highlight {
  id: string;
  bookId: string;
  text: string;
  page: number;
  isFavorite: boolean;
  createdAt: Date;
}
