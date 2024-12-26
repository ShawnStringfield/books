"use client";

import { Button } from "@/app/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useReadingGoals, useSettingsStore } from "../hooks/useSettingsStore";

export function ReadingGoalsSection() {
  const goals = useReadingGoals();
  const updateReadingGoals = useSettingsStore(
    (state) => state.updateReadingGoals
  );

  const handleGoalChange = (change: number) => {
    const newMonthlyTarget = Math.max(1, goals.monthlyTarget + change);
    updateReadingGoals({
      monthlyTarget: newMonthlyTarget,
      yearlyTarget: newMonthlyTarget * 12,
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleGoalChange(-1)}
          aria-label="Decrease monthly book target"
          disabled={goals.monthlyTarget <= 1}
        >
          <Minus className="w-4 h-4" />
        </Button>

        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold">{goals.monthlyTarget}</span>
          <span className="text-sm text-muted-foreground">books per month</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleGoalChange(1)}
          aria-label="Increase monthly book target"
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
