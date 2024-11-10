import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { containerVariants, itemVariants } from '../_animations';

interface ScheduleStepProps {
  selectedTimes: string[];
  onTimeSelect: (timeId: string) => void;
}

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning (6AM - 12PM)', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon (12PM - 5PM)', icon: '☀️' },
  { id: 'evening', label: 'Evening (5PM - 10PM)', icon: '🌆' },
  { id: 'night', label: 'Night (10PM - 6AM)', icon: '🌙' },
];

export const ScheduleStep = ({ selectedTimes, onTimeSelect }: ScheduleStepProps) => (
  <motion.div variants={containerVariants} className="space-y-6">
    <motion.h2 variants={itemVariants} className="text-3xl font-bold">
      Your Reading Schedule
    </motion.h2>
    <motion.p variants={itemVariants} className="text-gray-600">
      When do you prefer to read? This helps us send timely reminders.
    </motion.p>
    <motion.div variants={containerVariants} className="space-y-4">
      {TIME_SLOTS.map((time) => (
        <motion.div key={time.id} variants={itemVariants}>
          <Button variant={selectedTimes.includes(time.id) ? 'default' : 'outline'} className="w-full justify-start" onClick={() => onTimeSelect(time.id)}>
            <span className="mr-2">{time.icon}</span>
            {time.label}
            {selectedTimes.includes(time.id) && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </motion.div>
            )}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);
