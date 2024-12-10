'use client';

import React from 'react';
import { BookOpen, Highlighter } from 'lucide-react';
import { useOnboardingCheck } from '@/app/(features)/profile-onboarding/hooks/useOnboardingCheck';
import CurrentlyReading from './components/CurrentlyReading';
import WishlistOnboarding from './components/WishlistOnboarding';
import FavHighlightsOnboarding from './components/FavHighlightsOnboarding';
import RecentHighlights from './components/RecentHighlights';
import { useDashboardStore, selectBooks, selectHighlights, selectHasHydrated } from './stores/useDashboardStore';
import DashboardLayout from './components/DashboardLayout';
import { ReadingStatus } from '@/app/(features)/dashboard/types/books';
import { useBookGoals } from '@/app/(features)/profile-onboarding/hooks/useOnboardingStore';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  useOnboardingCheck();
  const hasHydrated = useDashboardStore(selectHasHydrated);
  const books = useDashboardStore(selectBooks);
  const highlights = useDashboardStore(selectHighlights);
  const bookGoals = useBookGoals();

  // Add this filter for currently reading books
  const currentlyReadingBooks = books.filter((book) => book.status === ReadingStatus.IN_PROGRESS);

  // Filter out highlights that don't have a corresponding book
  const validHighlights = highlights.filter((highlight) => books.some((book) => book.id === highlight.bookId));

  if (!hasHydrated) {
    return null; // or a loading spinner
  }

  const booksThisMonth = books.filter((b) => b.completedDate && new Date(b.completedDate).getMonth() === new Date().getMonth()).length;
  const booksThisYear = books.filter((b) => b.completedDate && new Date(b.completedDate).getFullYear() === new Date().getFullYear()).length;
  const highlightsThisMonth = validHighlights.filter((h) => new Date(h.createdAt).getMonth() === new Date().getMonth()).length;

  return (
    <div className="p-6 space-y-6">
      <div className="">
        <DashboardLayout>
          <StateCards
            booksThisMonth={booksThisMonth}
            booksThisYear={booksThisYear}
            highlightsThisMonth={highlightsThisMonth}
            monthlyGoal={bookGoals.monthlyTarget}
            yearlyGoal={bookGoals.yearlyTarget}
          />
          <CurrentlyReading books={currentlyReadingBooks} />
          <WishlistOnboarding />
          <FavHighlightsOnboarding />
          <RecentHighlights highlights={validHighlights} />
        </DashboardLayout>
      </div>
    </div>
  );
}

interface StateCardsProps {
  booksThisMonth: number;
  booksThisYear: number;
  highlightsThisMonth: number;
  monthlyGoal: number;
  yearlyGoal: number;
}

const StateCards = ({ booksThisMonth, booksThisYear, highlightsThisMonth, monthlyGoal, yearlyGoal }: StateCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      <StatCard
        icon={<BookOpen className="w-5 h-5" />}
        title="Books Read This Month"
        value={`${booksThisMonth} of ${monthlyGoal} books`}
        current={booksThisMonth}
        goal={monthlyGoal}
        period="this month"
      />
      <StatCard
        icon={<BookOpen className="w-5 h-5" />}
        title="Books Read This Year"
        value={`${booksThisYear} of ${yearlyGoal} books`}
        current={booksThisYear}
        goal={yearlyGoal}
        period="this year"
      />
      <StatCard
        icon={<Highlighter className="w-5 h-5" />}
        title="Highlights This Month"
        value={`${highlightsThisMonth} highlights`}
        current={highlightsThisMonth}
        goal={-1} // No goal for highlights, will hide progress bar
        period="this month"
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  current: number;
  goal: number;
  period: string;
}

function StatCard({ icon, title, value, current, goal, period }: StatCardProps) {
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div className="pt-6 relative">
      <div className="pb-2 text-gray-400">{icon}</div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="font-semibold">{value}</p>

      {/* Only show progress bar if there's a goal */}
      {goal > 0 && (
        <>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              key={`progress-${current}-${goal}`}
              className={`h-full rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                delay: 0.2,
              }}
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin={0}
              aria-valuemax={goal}
              aria-label={`${title} progress: ${current} out of ${goal} ${period}`}
            />
          </div>

          <motion.p
            className="text-xs text-gray-500 mt-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 1 }}>
              {progress.toFixed(0)}% complete
              {progress >= 100 && (
                <motion.span
                  className="ml-2 text-green-500"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 1.2,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  ✓ Goal achieved!
                </motion.span>
              )}
            </motion.span>
          </motion.p>
        </>
      )}
    </div>
  );
}
