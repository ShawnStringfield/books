'use client';

import React from 'react';
import { BookOpen, Quote } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
import CurrentlyReading from './components/CurrentlyReading';
import WishlistOnboarding from './components/WishlistOnboarding';
import FavHighlightsOnboarding from './components/FavHighlightsOnboarding';
import RecentHighlights from './components/RecentHighlights';
import { useDashboardStore, selectBooks, selectHighlights, selectHasHydrated } from './stores/useDashboardStore';
import DashboardLayout from './components/DashboardLayout';
import { ReadingStatus } from '@/app/(features)/dashboard/types/books';

export default function DashboardPage() {
  useOnboardingCheck();
  const hasHydrated = useDashboardStore(selectHasHydrated);
  const books = useDashboardStore(selectBooks);
  const highlights = useDashboardStore(selectHighlights);

  // Add this filter for currently reading books
  const currentlyReadingBooks = books.filter((book) => book.status === ReadingStatus.IN_PROGRESS);

  // Filter out highlights that don't have a corresponding book
  const validHighlights = highlights.filter((highlight) => books.some((book) => book.id === highlight.bookId));

  if (!hasHydrated) {
    return null; // or a loading spinner
  }

  const booksThisMonth = books.filter((b) => b.completedDate && new Date(b.completedDate).getMonth() === new Date().getMonth()).length;
  const booksThisYear = books.filter((b) => b.completedDate && new Date(b.completedDate).getFullYear() === new Date().getFullYear()).length;
  // Use validHighlights instead of highlights
  const highlightsThisMonth = validHighlights.filter((h) => new Date(h.createdAt).getMonth() === new Date().getMonth()).length;

  return (
    <div className="p-6 space-y-6">
      <div className="">
        <DashboardLayout>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Books Read"
              value={`${booksThisMonth} this month / ${booksThisYear} this year`}
            />
            <StatCard icon={<Quote className="w-6 h-6" />} title="New Highlights" value={`${highlightsThisMonth} this month`} />
          </div>
          {/* Pass the filtered books */}
          <CurrentlyReading books={currentlyReadingBooks} />
          <WishlistOnboarding />
          <FavHighlightsOnboarding />
          <RecentHighlights highlights={validHighlights} />
        </DashboardLayout>
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
