'use client';

import React from 'react';
import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
import CurrentlyReading from './components/CurrentlyReading';
import WishlistOnboarding from './components/WishlistOnboarding';
import FavHighlightsOnboarding from './components/FavHighlightsOnboarding';
import RecentHighlights from './components/RecentHighlights';
import { useBookStore, selectBooks, selectHasHydrated } from './stores/useBookStore';
import DashboardLayout from './components/DashboardLayout';
import { ReadingStatus } from '@/app/(features)/dashboard/types/books';
import DashboardStats from './components/stats/DashboardStats';

export default function DashboardPage() {
  useOnboardingCheck();
  const hasHydrated = useBookStore(selectHasHydrated);
  const books = useBookStore(selectBooks);

  const currentlyReadingBooks = books.filter((book) => book.status === ReadingStatus.IN_PROGRESS);

  if (!hasHydrated) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <DashboardStats />
        <CurrentlyReading books={currentlyReadingBooks} />

        <RecentHighlights limit={5} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <WishlistOnboarding />
          <FavHighlightsOnboarding />
        </div>
      </div>
    </DashboardLayout>
  );
}
