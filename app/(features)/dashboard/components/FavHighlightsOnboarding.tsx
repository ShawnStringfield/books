import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Heart } from 'lucide-react';
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

const FavHighlightsOnboarding = () => {
  const { books, highlights } = useDashboardStore();
  const favoriteHighlights = highlights.filter((h) => h.isFavorite);

  return (
    <Card className="my-4">
      <CardContent>
        {favoriteHighlights.length > 0 ? (
          <div className="space-y-4">
            {favoriteHighlights.slice(0, 3).map((highlight) => (
              <div key={highlight.id} className="border-l-2 border-yellow-400 pl-4">
                <p className="italic">{highlight.text}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {books.find((b) => b.id === highlight.bookId)?.title} - Page {highlight.page}
                </p>
              </div>
            ))}
            {favoriteHighlights.length > 3 && (
              <Button variant="link" className="text-sm w-full text-center">
                View all {favoriteHighlights.length} favorites
              </Button>
            )}
          </div>
        ) : (
          <EmptyFavoritesState />
        )}
      </CardContent>
    </Card>
  );
};

function EmptyFavoritesState() {
  return (
    <div className="text-center space-y-4 py-16 flex flex-col justify-center min-h-[300px]">
      <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
        <Heart className="w-6 h-6 text-gray-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Save Your Favorite Highlights</h3>
        <p className="text-sm text-gray-600 max-w-xs mx-auto">
          Mark highlights as favorites while reading to keep your most meaningful quotes and insights in one place.
        </p>
      </div>
    </div>
  );
}

export default FavHighlightsOnboarding;
