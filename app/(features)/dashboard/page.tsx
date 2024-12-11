'use client';

import React from 'react';
import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
import CurrentlyReading from './components/CurrentlyReading';
import WishlistOnboarding from './components/WishlistOnboarding';
import FavHighlightsOnboarding from './components/FavHighlightsOnboarding';
import RecentHighlights from './components/RecentHighlights';
import { useDashboardStore, selectBooks, selectHighlights, selectHasHydrated } from './stores/useDashboardStore';
import DashboardLayout from './components/DashboardLayout';
import { ReadingStatus } from '@/app/(features)/dashboard/types/books';
import { useBookGoals } from '@/app/(features)/profile-onboarding/hooks/useOnboardingStore';
import DashboardStats from './components/stats/DashboardStats';
import { calculateReadingStats, getValidHighlights } from './utils/statsCalculator';

export default function DashboardPage() {
  useOnboardingCheck();
  const hasHydrated = useDashboardStore(selectHasHydrated);
  const books = useDashboardStore(selectBooks);
  const highlights = useDashboardStore(selectHighlights);
  const bookGoals = useBookGoals();

  const currentlyReadingBooks = books.filter((book) => book.status === ReadingStatus.IN_PROGRESS);
  const validHighlights = getValidHighlights(highlights, books);

  if (!hasHydrated) return null;

  const { booksCompletedThisMonth, booksCompletedThisYear, highlightsThisMonth } = calculateReadingStats(books, highlights);

  console.log('books', books);

  return (
    <div className="p-6 space-y-6">
      <div className="">
        <DashboardLayout>
          <DashboardStats
            booksThisMonth={booksCompletedThisMonth}
            booksThisYear={booksCompletedThisYear}
            highlightsThisMonth={highlightsThisMonth}
            monthlyGoal={bookGoals.monthlyTarget}
            yearlyGoal={bookGoals.yearlyTarget}
          />
          <CurrentlyReading books={currentlyReadingBooks} />
          <RecentHighlights highlights={validHighlights} highlightsThisMonth={highlightsThisMonth} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WishlistOnboarding />
            <FavHighlightsOnboarding />
          </div>
        </DashboardLayout>
      </div>
    </div>
  );
}
