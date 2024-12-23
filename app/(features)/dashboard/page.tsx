'use client';

import React from 'react';
import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
import CurrentlyReading from '@/app/components/book/CurrentlyReading';
import FavHighlightsOnboarding from '@/app/components/highlights/FavHighlightsOnboarding';
import RecentHighlights from '@/app/components/highlights/RecentHighlights';
import { useBookStore, selectBooks, selectHasHydrated, selectHighlights } from '@/app/stores/useBookStore';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { ReadingStatus } from '@/app/stores/types';
import DashboardStats from '@/app/components/dashboard/stats/DashboardStats';

export default function DashboardPage() {
  useOnboardingCheck();
  const hasHydrated = useBookStore(selectHasHydrated);
  const books = useBookStore(selectBooks);
  const highlights = useBookStore(selectHighlights);

  const currentlyReadingBooks = books.filter((book) => book.status === ReadingStatus.IN_PROGRESS);
  const hasRecentHighlights = highlights.length > 0;
  const hasFavoriteHighlights = highlights.some((h) => h.isFavorite);
  const bothEmpty = !hasRecentHighlights && !hasFavoriteHighlights;

  if (!hasHydrated) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <DashboardStats />
        </div>
        <div className="mb-8">
          <CurrentlyReading books={currentlyReadingBooks} />
        </div>
        {bothEmpty ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RecentHighlights limit={5} />
            <FavHighlightsOnboarding />
          </div>
        ) : (
          <div className="space-y-6">
            <RecentHighlights limit={5} />
            <FavHighlightsOnboarding />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
