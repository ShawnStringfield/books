import React from 'react';
import { StatCard } from './StatCard';

interface YearlyStatsProps {
  booksThisYear: number;
  yearlyGoal: number;
}

export const YearlyStats = ({ booksThisYear, yearlyGoal }: YearlyStatsProps) => {
  return (
    <StatCard
      icon={<span className="text-lg font-semibold">{new Date().getFullYear()}</span>}
      title="Books Read This Year"
      value={`${booksThisYear} of ${yearlyGoal} books`}
      current={booksThisYear}
      goal={yearlyGoal}
      period="this year"
    />
  );
};
