import React from 'react';
import { MonthlyStats } from './MonthlyStats';
import { YearlyStats } from './YearlyStats';
import { useBookStore, selectBooks, selectIsLoading, selectError, selectHasHydrated } from '../../stores/useBookStore';
import { useBookGoals } from '@/app/(features)/profile-onboarding/hooks/useOnboardingStore';
import { calculateReadingStats } from '../../utils/bookUtils';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const StatsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
    <Skeleton className="h-[180px] w-full" />
    <Skeleton className="h-[180px] w-full" />
  </div>
);

export const DashboardStats = () => {
  const books = useBookStore(selectBooks);
  const isLoading = useBookStore(selectIsLoading);
  const error = useBookStore(selectError);
  const hasHydrated = useBookStore(selectHasHydrated);
  const bookGoals = useBookGoals();

  if (!hasHydrated || isLoading) {
    return <StatsLoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load reading stats: {error}</AlertDescription>
      </Alert>
    );
  }

  const { booksCompletedThisMonth, booksCompletedThisYear } = calculateReadingStats(books);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
      <MonthlyStats booksThisMonth={booksCompletedThisMonth} monthlyGoal={bookGoals.monthlyTarget} />
      <YearlyStats booksThisYear={booksCompletedThisYear} yearlyGoal={bookGoals.yearlyTarget} />
    </div>
  );
};

export default DashboardStats;
