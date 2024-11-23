import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { STEPS } from '@profile-onboarding/constants';
import type { StepId } from '@profile-onboarding/types/onboarding';
import ProgressCompletion from './ProgressCompletion';
interface ProgressStepsProps {
  steps: typeof STEPS;
  currentStep: StepId;
  completedSteps: StepId[];
  onStepClick: (step: StepId) => void;
}

export const ProgressSteps = ({ steps, currentStep, completedSteps, onStepClick }: ProgressStepsProps) => (
  <div className="flex justify-between px-2 mt-2">
    {steps.map((step, index) => {
      const isCompleted = completedSteps.includes(step);
      const isCurrent = currentStep === step;

      return (
        <motion.button
          key={step}
          onClick={() => onStepClick(step)}
          className={`flex flex-col items-center flex-1 ${
            isCompleted || isCurrent ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            color: isCurrent || isCompleted ? 'rgb(37, 99, 235)' : 'rgb(156, 163, 175)',
          }}
        >
          <div className={`text-xs font-medium capitalize`}>{step}</div>
          <ProgressCompletion index={index} stepsLength={steps.length} />
          {isCompleted && !isCurrent && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              className="mt-1 text-green-500"
            >
              <CheckCircle2 className="w-4 h-4" />
            </motion.div>
          )}
        </motion.button>
      );
    })}
  </div>
);
