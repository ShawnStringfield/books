'use client';
import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookOpen, Quote } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
import AddBookOnboarding from './components/AddBookOnboarding';
import WishlistOnboarding from './components/WishlistOnboarding';
import FavHighlightsOnboarding from './components/FavHighlightsOnboarding';
import RecentHighlights from './components/RecentHighlights';
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

  const booksThisMonth = books.filter((b) => b.completedDate && new Date(b.completedDate).getMonth() === new Date().getMonth()).length;
  const booksThisYear = books.filter((b) => b.completedDate && new Date(b.completedDate).getFullYear() === new Date().getFullYear()).length;
  const highlightsThisMonth = highlights.filter((h) => new Date(h.createdAt).getMonth() === new Date().getMonth()).length;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen className="w-6 h-6" />} title="Books Read" value={`${booksThisMonth} this month / ${booksThisYear} this year`} />
        <StatCard icon={<Quote className="w-6 h-6" />} title="New Highlights" value={`${highlightsThisMonth} this month`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddBookOnboarding />
        <WishlistOnboarding />
        <FavHighlightsOnboarding />
        <RecentHighlights />
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
