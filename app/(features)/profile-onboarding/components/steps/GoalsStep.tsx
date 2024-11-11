import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { containerVariants, itemVariants } from '../_animations';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { useOnboardingStore } from '../../hooks/useOnboardingStore';

// Optional: Add a default value for type safety
const DEFAULT_GOALS = {
  monthlyTarget: 2,
  yearlyTarget: 24,
};

export const GoalsStep = () => {
  const { bookGoals = DEFAULT_GOALS, updateData } = useOnboardingStore();

  const updateBookGoals = (monthly: number) => {
    updateData({
      bookGoals: {
        monthlyTarget: monthly,
        yearlyTarget: monthly * 12,
      },
    });
  };

  return (
    <motion.div variants={containerVariants} className="space-y-6">
      <motion.h2 variants={itemVariants} className="text-3xl font-bold">
        Set Your Reading Goals
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-600">
        How many books would you like to read?
      </motion.p>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Books per Month</Label>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => updateBookGoals(Math.max(1, bookGoals.monthlyTarget - 1))} aria-label="Decrease monthly book target">
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{bookGoals.monthlyTarget}</span>
                <Button variant="outline" size="sm" onClick={() => updateBookGoals(Math.min(50, bookGoals.monthlyTarget + 1))} aria-label="Increase monthly book target">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Yearly goal</span>
                <span className="font-medium">{bookGoals.yearlyTarget} books</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">{`That's about ${Math.round(bookGoals.yearlyTarget / 52)} books per week`}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <motion.div variants={itemVariants} className="text-sm text-gray-600">
        <p>{`Next, you'll be able to set your preferred reading schedule and reminders.`}</p>
      </motion.div>
    </motion.div>
  );
};
