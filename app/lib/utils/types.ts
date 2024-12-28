export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  status: string;
  currentPage?: number;
  totalPages?: number;
}
