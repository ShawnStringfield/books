import React from 'react';
import { StatCard } from './StatCard';

interface MonthlyStatsProps {
  booksThisMonth: number;
  monthlyGoal: number;
}

export const MonthlyStats = ({ booksThisMonth, monthlyGoal }: MonthlyStatsProps) => {
  return (
    <StatCard
      icon={<span className="text-lg font-semibold">{new Date().toLocaleString('default', { month: 'short' })}</span>}
      title="Books Read This Month"
      value={`${booksThisMonth} of ${monthlyGoal} books`}
      current={booksThisMonth}
      goal={monthlyGoal}
      period="this month"
    />
  );
};
