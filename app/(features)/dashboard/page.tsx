'use client';
import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookOpen, Star, Clock, List, BookMarked, Quote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
// import GoogleBooks from './components/GoogleBooks';

// Types
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

// Store
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

export default function DashboardPage() {
  useOnboardingCheck();

  const { books, highlights } = useDashboardStore();

  const currentlyReading = books.find((b) => b.currentPage && !b.completedDate);
  const wishlist = books.filter((b) => !b.startDate);
  const booksThisMonth = books.filter((b) => b.completedDate && new Date(b.completedDate).getMonth() === new Date().getMonth()).length;
  const booksThisYear = books.filter((b) => b.completedDate && new Date(b.completedDate).getFullYear() === new Date().getFullYear()).length;
  const highlightsThisMonth = highlights.filter((h) => new Date(h.createdAt).getMonth() === new Date().getMonth()).length;
  const favoriteHighlights = highlights.filter((h) => h.isFavorite);
  const recentHighlights = [...highlights].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen className="w-6 h-6" />} title="Books Read" value={`${booksThisMonth} this month / ${booksThisYear} this year`} />
        <StatCard icon={<Quote className="w-6 h-6" />} title="New Highlights" value={`${highlightsThisMonth} this month`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentlyReading && (
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
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="w-5 h-5" />
              Wishlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wishlist.slice(0, 3).map((book) => (
                <div key={book.id} className="flex items-center gap-3">
                  <BookMarked className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Favorite Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {favoriteHighlights.slice(0, 3).map((highlight) => (
                <div key={highlight.id} className="border-l-2 border-yellow-400 pl-4">
                  <p className="italic">{highlight.text}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {books.find((b) => b.id === highlight.bookId)?.title} - Page {highlight.page}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Quote className="w-5 h-5" />
              Recent Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentHighlights.map((highlight) => (
                <div key={highlight.id} className="border-l-2 border-gray-200 pl-4">
                  <p>{highlight.text}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {books.find((b) => b.id === highlight.bookId)?.title} - Page {highlight.page}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
