// app/(features)/profile-onboarding/components/steps/GoalsStep.tsx

import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import { Target } from 'lucide-react';
import { containerVariants, itemVariants } from '../_animations';

interface BookGoals {
  monthlyTarget: number;
  yearlyTarget: number;
}

interface GoalsStepProps {
  goals: BookGoals;
  onGoalsUpdate: (goals: BookGoals) => void;
}

export const GoalsStep = ({ goals, onGoalsUpdate }: GoalsStepProps) => {
  const handleGoalSelect = (monthlyTarget: number) => {
    console.log('lick');
    onGoalsUpdate({
      monthlyTarget,
      yearlyTarget: monthlyTarget * 12,
    });
  };

  const GOALS = [
    {
      id: '1',
      title: '1 Book Monthly',
      description: 'Perfect for casual readers',
      monthlyTarget: 1,
    },
    {
      id: '2',
      title: '2 Books Monthly',
      description: 'Regular reading habit',
      monthlyTarget: 2,
    },
    {
      id: '4',
      title: '4 Books Monthly',
      description: 'Avid reader',
      monthlyTarget: 4,
    },
    {
      id: 'custom',
      title: 'Custom Goal',
      description: 'Set your own target',
      monthlyTarget: goals.monthlyTarget,
    },
  ];

  return (
    <motion.div variants={containerVariants} className="space-y-6">
      <motion.h2 variants={itemVariants} className="text-3xl font-bold">
        Set Your Reading Goals
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-600">
        How many books would you like to read each month?
      </motion.p>
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GOALS.map((goal) => (
          <motion.div key={goal.id} variants={itemVariants}>
            <Button
              variant={goals.monthlyTarget === goal.monthlyTarget ? 'default' : 'outline'}
              className="w-full h-auto p-6 text-left"
              onClick={() => handleGoalSelect(goal.monthlyTarget)}
            >
              <div className="flex items-center w-full">
                <Target className="w-6 h-6 mr-2" />
                <div>
                  <div className="font-semibold">{goal.title}</div>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {goals.monthlyTarget > 0 && (
        <motion.div variants={itemVariants} className="mt-6 text-center text-gray-600">
          <p>Your yearly target: {goals.yearlyTarget} books</p>
        </motion.div>
      )}
    </motion.div>
  );
};
