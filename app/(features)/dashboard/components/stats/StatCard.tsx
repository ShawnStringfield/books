import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  current: number;
  goal: number;
  period: string;
}

export const StatCard = ({ icon, title, value, current, goal, period }: StatCardProps) => {
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div className="pt-6 relative">
      <div className="pb-2 text-gray-400">{icon}</div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="font-semibold">{value}</p>

      {goal > 0 && (
        <>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              key={`progress-${current}-${goal}`}
              className={`h-full rounded-full ${progress >= 100 ? 'bg-blue-400' : 'bg-blue-200'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.8,
                ease: 'easeOut',
                delay: 0.2,
              }}
              role="progressbar"
              aria-valuenow={current}
              aria-valuemin={0}
              aria-valuemax={goal}
              aria-label={`${title} progress: ${current} out of ${goal} ${period}`}
            />
          </div>

          <motion.p
            className="text-xs text-gray-500 mt-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 1 }}>
              {progress.toFixed(0)}%
              {progress >= 100 && (
                <motion.span
                  className="ml-2 text-green-500"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 1.2,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  ✓ Goal achieved!
                </motion.span>
              )}
            </motion.span>
          </motion.p>
        </>
      )}
    </div>
  );
};
