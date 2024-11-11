// components/steps/ScheduleStep.tsx
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Plus, Bell } from 'lucide-react';
import { containerVariants, itemVariants } from '../_animations';
import { Card, CardContent } from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useOnboardingStore } from '../../hooks/useOnboardingStore';
import type { DayOfWeek, ReadingTimePreference } from '../../types/onboarding';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const TIME_SLOTS = Array.from({ length: 24 * 4 }).map((_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export const ScheduleStep = () => {
  const { readingSchedule, updateData } = useOnboardingStore();

  const addTimePreference = () => {
    const newPreference: ReadingTimePreference = {
      time: '07:00',
      daysOfWeek: [],
      duration: 30,
      notifications: true,
    };

    updateData({
      readingSchedule: {
        preferences: [...readingSchedule.preferences, newPreference],
      },
    });
  };

  const updateTimePreference = (index: number, updates: Partial<ReadingTimePreference>) => {
    const newPreferences = [...readingSchedule.preferences];
    newPreferences[index] = { ...newPreferences[index], ...updates };

    updateData({
      readingSchedule: {
        preferences: newPreferences,
      },
    });
  };

  const removeTimePreference = (index: number) => {
    const newPreferences = readingSchedule.preferences.filter((_, i) => i !== index);

    updateData({
      readingSchedule: {
        preferences: newPreferences,
      },
    });
  };

  return (
    <motion.div variants={containerVariants} className="space-y-6">
      <motion.h2 variants={itemVariants} className="text-3xl font-bold">
        Set Your Reading Schedule
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-600">
        {`Choose when you'd like to read and set reminders`}
      </motion.p>

      <div className="space-y-4">
        {readingSchedule.preferences.map((pref, index) => (
          <Card key={index}>
            <CardContent className="pt-6 grid gap-4">
              <div className="flex items-center justify-between">
                <Select value={pref.time} onValueChange={(value) => updateTimePreference(index, { time: value })}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => removeTimePreference(index)} className="text-red-500 hover:text-red-700">
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <Button
                    key={day}
                    variant={pref.daysOfWeek.includes(day as DayOfWeek) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const newDays = pref.daysOfWeek.includes(day as DayOfWeek) ? pref.daysOfWeek.filter((d) => d !== day) : [...pref.daysOfWeek, day as DayOfWeek];
                      updateTimePreference(index, { daysOfWeek: newDays });
                    }}
                    className="capitalize"
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>

              <Select value={pref.duration.toString()} onValueChange={(value) => updateTimePreference(index, { duration: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Switch id={`notifications-${index}`} checked={pref.notifications} onCheckedChange={(checked) => updateTimePreference(index, { notifications: checked })} />
                <Label htmlFor={`notifications-${index}`} className="flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Remind me
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addTimePreference} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Reading Time
        </Button>
      </div>
    </motion.div>
  );
};
