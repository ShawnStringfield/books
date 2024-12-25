// app/(features)/profile-onboarding/components/steps/GoalsStep.tsx

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { containerVariants, itemVariants } from "../_animations";
import { STEPS } from "../../constants";

interface BookGoals {
  monthlyTarget: number;
  yearlyTarget: number;
}

interface GoalsStepProps {
  goals: BookGoals;
  onGoalsUpdate: (goals: BookGoals) => void;
}

export const GoalsStep = ({ goals, onGoalsUpdate }: GoalsStepProps) => {
  const handleGoalChange = (change: number) => {
    const newMonthlyTarget = Math.max(1, goals.monthlyTarget + change);
    onGoalsUpdate({
      monthlyTarget: newMonthlyTarget,
      yearlyTarget: newMonthlyTarget * 12,
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      className="space-y-6"
      data-testid={`step-content-${STEPS[2]}`}
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold">
        Set Your Reading Goals
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-600">
        How many books would you like to read each month?
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center space-y-4"
      >
        <div className="flex items-center space-x-4">
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
            <span className="text-sm text-gray-600">books per month</span>
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

        <motion.div
          variants={itemVariants}
          className="text-center text-gray-600"
        >
          <p>Your yearly target: {goals.yearlyTarget} books</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
