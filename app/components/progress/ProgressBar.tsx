import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => (
  <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
    <motion.div
      className="absolute left-0 top-0 bottom-0 bg-blue-600 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 15,
        mass: 1,
      }}
    />
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-md"
      animate={{ left: `${value}%` }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 15,
        mass: 1,
      }}
    />
  </div>
);
