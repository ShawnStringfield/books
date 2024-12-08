import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { BookText, Quote } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  totalPages: number;
  currentPage?: number;
  startDate?: Date;
  completedDate?: Date;
}

interface Highlight {
  id: string;
  bookId: string;
  text: string;
  page: number;
  isFavorite: boolean;
  createdAt: Date;
}

interface DashboardStore {
  books: Book[];
  highlights: Highlight[];
  addBook: (book: Book) => void;
  addHighlight: (highlight: Highlight) => void;
  toggleFavoriteHighlight: (id: string) => void;
  updateReadingProgress: (bookId: string, currentPage: number) => void;
}

const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      books: [],
      highlights: [],
      addBook: (book) => set((state) => ({ books: [...state.books, book] })),
      addHighlight: (highlight) => set((state) => ({ highlights: [...state.highlights, highlight] })),
      toggleFavoriteHighlight: (id) =>
        set((state) => ({
          highlights: state.highlights.map((h) => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h)),
        })),
      updateReadingProgress: (bookId, currentPage) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === bookId ? { ...b, currentPage } : b)),
        })),
    }),
    { name: 'dashboard-store' }
  )
);

const RecentHighlights = () => {
  const { books, highlights } = useDashboardStore();
  const recentHighlights = [...highlights].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="w-5 h-5" />
          Recent Highlights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentHighlights.length > 0 ? (
          <div className="space-y-4">
            {recentHighlights.map((highlight) => (
              <div key={highlight.id} className="border-l-2 border-gray-200 pl-4">
                <p>{highlight.text}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {books.find((b) => b.id === highlight.bookId)?.title} - Page {highlight.page}
                </p>
              </div>
            ))}
            {recentHighlights.length > 5 && (
              <Button variant="link" className="text-sm w-full text-center">
                View all highlights
              </Button>
            )}
          </div>
        ) : (
          <EmptyRecentHighlightsState />
        )}
      </CardContent>
    </Card>
  );
};

function EmptyRecentHighlightsState() {
  return (
    <div className="text-center space-y-4 py-6">
      <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
        <BookText className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Capture Your First Highlight</h3>
        <p className="text-sm text-gray-600 max-w-xs mx-auto">
          Save memorable quotes, insights, and passages from your books. They&apos;ll appear here for easy reference.
        </p>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg mx-auto max-w-xs space-y-2">
          <p className="font-medium">How to add highlights:</p>
          <ul className="text-left space-y-1">
            <li>1. Open a book you&apos;re reading</li>
            <li>2. Select the text you want to save</li>
            <li>3. Add any notes or tags</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RecentHighlights;
