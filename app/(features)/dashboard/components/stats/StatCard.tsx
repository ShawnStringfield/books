import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  current: number;
  goal: number;
  period: string;
}

export const StatCard = ({
  icon,
  title,
  value,
  current,
  goal,
  period,
}: StatCardProps) => {
  // Keep track of the previous value to animate from
  const [prevCurrent, setPrevCurrent] = useState(current);
  const [displayCurrent, setDisplayCurrent] = useState(current);

  useEffect(() => {
    // If we're going from a non-zero to zero, delay the update
    if (current === 0 && prevCurrent > 0) {
      const timer = setTimeout(() => {
        setDisplayCurrent(current);
        setPrevCurrent(current);
      }, 300); // Match this with the progress bar animation duration
      return () => clearTimeout(timer);
    } else {
      setDisplayCurrent(current);
      setPrevCurrent(current);
    }
  }, [current, prevCurrent]);

  const progress = goal > 0 ? Math.min((displayCurrent / goal) * 100, 100) : 0;
  const prevProgress = goal > 0 ? Math.min((prevCurrent / goal) * 100, 100) : 0;

  return (
    <div className="pt-6 relative">
      <div className="pb-2 text-gray-400">{icon}</div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <motion.p
        className="font-semibold"
        key={value}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.p>

      {goal > 0 && (
        <>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                progress >= 100 ? "bg-blue-400" : "bg-blue-200"
              }`}
              initial={{ width: `${prevProgress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 20,
                mass: 1,
              }}
              role="progressbar"
              aria-valuenow={displayCurrent}
              aria-valuemin={0}
              aria-valuemax={goal}
              aria-label={`${title} progress: ${displayCurrent} out of ${goal} ${period}`}
            />
          </div>

          <motion.p className="text-xs text-gray-500 mt-1" layout>
            <motion.span layout>
              {progress.toFixed(0)}%
              <AnimatePresence mode="wait">
                {progress >= 100 && (
                  <motion.span
                    className="ml-2 text-green-500 inline-block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                  >
                    ✓ Goal achieved!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
          </motion.p>
        </>
      )}
    </div>
  );
};
