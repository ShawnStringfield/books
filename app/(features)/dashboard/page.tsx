'use client';

import React from 'react';
import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
import CurrentlyReading from '@/app/components/book/CurrentlyReading';
import WishlistOnboarding from '@/app/components/book/WishlistOnboarding';
import FavHighlightsOnboarding from '@/app/components/highlights/FavHighlightsOnboarding';
import RecentHighlights from '@/app/components/highlights/RecentHighlights';
import { useBookStore, selectBooks, selectHasHydrated } from '@/app/stores/useBookStore';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { ReadingStatus } from '@/app/stores/types';
import DashboardStats from '@/app/components/dashboard/stats/DashboardStats';

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

        <FavHighlightsOnboarding />
        <RecentHighlights limit={5} />

        <WishlistOnboarding />
      </div>
    </DashboardLayout>
  );
}
