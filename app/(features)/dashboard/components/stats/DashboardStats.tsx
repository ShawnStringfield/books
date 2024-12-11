import React from 'react';
import { MonthlyStats } from './MonthlyStats';
import { YearlyStats } from './YearlyStats';

interface DashboardStatsProps {
  booksThisMonth: number;
  booksThisYear: number;
  highlightsThisMonth: number;
  monthlyGoal: number;
  yearlyGoal: number;
}

export const DashboardStats = ({ booksThisMonth, booksThisYear, monthlyGoal, yearlyGoal }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
      <MonthlyStats booksThisMonth={booksThisMonth} monthlyGoal={monthlyGoal} />
      <YearlyStats booksThisYear={booksThisYear} yearlyGoal={yearlyGoal} />
    </div>
  );
};

export default DashboardStats;
