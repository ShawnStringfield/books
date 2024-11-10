import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Target, Clock } from 'lucide-react';
import { containerVariants, itemVariants } from '../_animations';

interface GoalsStepProps {
  selectedGoal: string | null;
  onGoalSelect: (goalId: string) => void;
}

const GOALS = [
  {
    id: 'books',
    title: 'Books per Month',
    description: 'Set a target number of books to read each month',
    icon: Target,
  },
  {
    id: 'time',
    title: 'Reading Time',
    description: 'Set daily or weekly reading time goals',
    icon: Clock,
  },
];

export const GoalsStep = ({ selectedGoal, onGoalSelect }: GoalsStepProps) => (
  <motion.div variants={containerVariants} className="space-y-6">
    <motion.h2 variants={itemVariants} className="text-3xl font-bold">
      Set Your Reading Goals
    </motion.h2>
    <motion.p variants={itemVariants} className="text-gray-600">
      What would you like to achieve with your reading?
    </motion.p>
    <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {GOALS.map((goal) => (
        <motion.div key={goal.id} variants={itemVariants}>
          <Button variant={selectedGoal === goal.id ? 'default' : 'outline'} className="w-full h-auto p-6 text-left" onClick={() => onGoalSelect(goal.id)}>
            <div className="flex items-center w-full">
              <goal.icon className="w-6 h-6 mr-2" />
              <div>
                <div className="font-semibold">{goal.title}</div>
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
              </div>
            </div>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);
