import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  showKnob?: boolean;
  bleed?: boolean;
  variant?: 'default' | 'bleed';
}

export const ProgressBar = ({ value, showKnob = false, bleed = false, variant = 'default' }: ProgressBarProps) => {
  const isBleed = bleed || variant === 'bleed';
  return (
    <div role="progressbar" className={`relative h-2 w-full bg-gray-100 ${isBleed ? '' : 'rounded-full'} ${!isBleed ? 'overflow-hidden' : ''}`}>
      <motion.div
        className={`absolute left-0 top-0 bottom-0 bg-blue-600 ${isBleed ? '' : 'rounded-full'}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 15,
          mass: 1,
        }}
      />
      {showKnob && (
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
      )}
    </div>
  );
};
