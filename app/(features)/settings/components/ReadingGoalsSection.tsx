"use client";

import { Button } from "@/app/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useReadingGoalsQuery } from "../hooks/useReadingGoalsQuery";
import { Skeleton } from "@/app/components/ui/skeleton";

export function ReadingGoalsSection() {
  const { goals, isLoading, isPending, updateGoals } = useReadingGoalsQuery();

  const handleGoalChange = (change: number) => {
    const newMonthlyTarget = Math.max(1, goals.monthlyTarget + change);
    const newGoals = {
      monthlyTarget: newMonthlyTarget,
      yearlyTarget: newMonthlyTarget * 12,
    };
    updateGoals(newGoals);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="text-center">
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleGoalChange(-1)}
          aria-label="Decrease monthly book target"
          disabled={goals.monthlyTarget <= 1 || isPending}
          className={isPending ? "opacity-50 cursor-not-allowed" : ""}
        >
          <Minus className="w-4 h-4" />
        </Button>

        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold relative">
            {goals.monthlyTarget}
            {isPending && (
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
          </span>
          <span className="text-sm text-muted-foreground">books per month</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleGoalChange(1)}
          aria-label="Increase monthly book target"
          disabled={isPending}
          className={isPending ? "opacity-50 cursor-not-allowed" : ""}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center text-muted-foreground">
        <p>Your yearly target: {goals.yearlyTarget} books</p>
      </div>
    </div>
  );
}
