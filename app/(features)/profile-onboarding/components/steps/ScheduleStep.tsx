import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { containerVariants, itemVariants } from '../_animations';

interface ReadingPreference {
  daysOfWeek: string[];
  timeOfDay: string;
  notifications: boolean;
}

interface ReadingSchedule {
  preferences: ReadingPreference[];
}

interface ScheduleStepProps {
  schedule: ReadingSchedule;
  onScheduleUpdate: (schedule: ReadingSchedule) => void;
}

const DAYS_OF_WEEK = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
  { id: 'sat', label: 'Saturday' },
  { id: 'sun', label: 'Sunday' },
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning (6AM - 12PM)', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon (12PM - 5PM)', icon: '☀️' },
  { id: 'evening', label: 'Evening (5PM - 10PM)', icon: '🌆' },
  { id: 'night', label: 'Night (10PM - 6AM)', icon: '🌙' },
];

export const ScheduleStep = ({ schedule, onScheduleUpdate }: ScheduleStepProps) => {
  const currentPreference = schedule.preferences[0] || {
    daysOfWeek: [],
    timeOfDay: '',
    notifications: true,
  };

  const handleDayToggle = (dayId: string) => {
    const updatedDays = currentPreference.daysOfWeek.includes(dayId)
      ? currentPreference.daysOfWeek.filter((d) => d !== dayId)
      : [...currentPreference.daysOfWeek, dayId];

    const updatedPreference: ReadingPreference = {
      ...currentPreference,
      daysOfWeek: updatedDays,
    };

    onScheduleUpdate({
      preferences: [updatedPreference],
    });
  };

  const handleTimeSelect = (timeId: string) => {
    const updatedPreference: ReadingPreference = {
      ...currentPreference,
      timeOfDay: timeId,
    };

    onScheduleUpdate({
      preferences: [updatedPreference],
    });
  };

  const toggleNotifications = () => {
    const updatedPreference: ReadingPreference = {
      ...currentPreference,
      notifications: !currentPreference.notifications,
    };

    onScheduleUpdate({
      preferences: [updatedPreference],
    });
  };

  return (
    <motion.div variants={containerVariants} className="space-y-6">
      <motion.h2 variants={itemVariants} className="text-3xl font-bold">
        Your Reading Schedule
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-600">
        When do you prefer to read? This helps us send timely reminders.
      </motion.p>

      {/* Days of Week Selection */}
      <motion.div variants={containerVariants} className="space-y-4">
        <h3 className="text-lg font-semibold">Reading Days</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DAYS_OF_WEEK.map((day) => (
            <Button
              key={day.id}
              variant={currentPreference.daysOfWeek.includes(day.id) ? 'default' : 'outline'}
              onClick={() => handleDayToggle(day.id)}
              className="w-full"
            >
              {day.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Time of Day Selection */}
      <motion.div variants={containerVariants} className="space-y-4">
        <h3 className="text-lg font-semibold">Preferred Time</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TIME_SLOTS.map((time) => (
            <Button
              key={time.id}
              variant={currentPreference.timeOfDay === time.id ? 'default' : 'outline'}
              onClick={() => handleTimeSelect(time.id)}
              className="w-full justify-start"
            >
              <span className="mr-2">{time.icon}</span>
              {time.label}
              {currentPreference.timeOfDay === time.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </motion.div>
              )}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Notifications Toggle */}
      <motion.div variants={itemVariants} className="pt-4">
        <Button variant={currentPreference.notifications ? 'default' : 'outline'} onClick={toggleNotifications} className="w-full md:w-auto">
          {currentPreference.notifications ? '✓ Notifications Enabled' : 'Enable Notifications'}
        </Button>
      </motion.div>

      {currentPreference.daysOfWeek.length > 0 && currentPreference.timeOfDay && (
        <motion.div variants={itemVariants} className="p-4 bg-blue-50 rounded-lg text-blue-700 text-sm">
          <p>
            {`You'll read on`}{' '}
            {currentPreference.daysOfWeek.map((day, i, arr) => {
              const dayLabel = DAYS_OF_WEEK.find((d) => d.id === day)?.label;
              if (i === arr.length - 1) return dayLabel;
              if (i === arr.length - 2) return `${dayLabel} and `;
              return `${dayLabel}, `;
            })}{' '}
            during {TIME_SLOTS.find((t) => t.id === currentPreference.timeOfDay)?.label.toLowerCase()}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
