import React, { useMemo } from "react";
import { MonthlyStats } from "@/app/(features)/dashboard/components/stats/MonthlyStats";
import { YearlyStats } from "@/app/(features)/dashboard/components/stats/YearlyStats";
import { useBooks } from "@/app/hooks/books/useBooks";
import { useBookGoals } from "@/app/(features)/profile-onboarding/hooks/useBookGoals";
import { calculateReadingStats } from "@/app/utils/bookUtils";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { AlertCircle } from "lucide-react";

const StatsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
    <Skeleton className="h-[180px] w-full" />
    <Skeleton className="h-[180px] w-full" />
  </div>
);

export const DashboardStats = () => {
  const { data: books = [], isLoading, error } = useBooks();
  const bookGoals = useBookGoals();

  // Memoize stats calculation to prevent unnecessary recalculations
  const stats = useMemo(() => calculateReadingStats(books), [books]);

  // Only show loading state on initial load when we have no data
  if (isLoading && !books.length) {
    return <StatsLoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load reading stats: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-8 mb-8">
      <MonthlyStats
        booksThisMonth={stats.booksCompletedThisMonth}
        monthlyGoal={bookGoals.monthlyTarget}
      />
      <YearlyStats
        booksThisYear={stats.booksCompletedThisYear}
        yearlyGoal={bookGoals.yearlyTarget}
      />
    </div>
  );
};

export default DashboardStats;
