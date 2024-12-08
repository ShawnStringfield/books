import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Clock, Library, PlusCircle } from 'lucide-react';
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

const AddBookOnboarding = () => {
  const { books } = useDashboardStore();
  const currentlyReading = books.find((b) => b.currentPage && !b.completedDate);

  const handleAddBook = () => {
    // setIsAddBookModalOpen(true);
    // You would implement the AddBookModal component separately
  };

  return (
    <div>
      {currentlyReading ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Currently Reading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              {currentlyReading.coverUrl && (
                <img src={currentlyReading.coverUrl} alt={currentlyReading.title} className="w-24 h-36 object-cover rounded" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{currentlyReading.title}</h3>
                <p className="text-sm text-gray-600">{currentlyReading.author}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(currentlyReading.currentPage! / currentlyReading.totalPages) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-sm mt-1">
                  Page {currentlyReading.currentPage} of {currentlyReading.totalPages}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyReadingState onAddBook={handleAddBook} />
      )}
    </div>
  );
};

function EmptyReadingState({ onAddBook }: { onAddBook: () => void }) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-white">
      <CardContent className="pt-6">
        <div className="text-center space-y-4 py-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Library className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Start Your Reading Journey</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Track your reading progress, collect meaningful highlights, and discover new books to read.
            </p>
          </div>
          <Button onClick={onAddBook} className="mt-4 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Your First Book
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AddBookOnboarding;
