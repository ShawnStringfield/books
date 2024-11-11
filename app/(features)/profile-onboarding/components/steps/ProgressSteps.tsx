import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { STEPS } from '@/lib/onboarding/constants';
import type { StepId } from '@/app/(features)/profile-onboarding/types/onboarding';

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
          className={`flex flex-col items-center flex-1 $ ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            color: isCurrent ? 'rgb(37, 99, 235)' : isCompleted ? 'rgb(37, 99, 235)' : 'rgb(156, 163, 175)',
          }}
        >
          <div className="text-xs font-medium capitalize">{step}</div>
          <div className="text-xs">
            {index + 1}/{steps.length}
          </div>
          {isCompleted && !isCurrent && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1">
              <CheckCircle2 className="w-3 h-3" />
            </motion.div>
          )}
        </motion.button>
      );
    })}
  </div>
);
