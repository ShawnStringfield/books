import { ReactNode } from 'react';
import { Button } from '@/app/components/ui/button';
import { ProgressBar } from './ProgressBar';
import { ProgressSteps } from './ProgressSteps';
import { Loader2 } from 'lucide-react';

export interface ProgressWizardProps {
  children: ReactNode;
  progress: number;
  steps: string[];
  currentStep: string;
  completedSteps: string[];
  onStepChange: (targetStep: string) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onPreviousStep: () => void;
  onNextStep: () => void;
  isLoading?: boolean;
}

export function ProgressWizard({
  children,
  progress,
  steps,
  currentStep,
  completedSteps,
  onStepChange,
  isFirstStep,
  isLastStep,
  onPreviousStep,
  onNextStep,
  isLoading = false,
}: ProgressWizardProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container max-w-4xl mx-auto py-8">
        <div className="space-y-8">
          <ProgressBar value={progress} showKnob />

          <ProgressSteps steps={steps} currentStep={currentStep} completedSteps={completedSteps} onStepClick={onStepChange} />

          <div className="bg-card rounded-lg shadow-sm p-6">{children}</div>

          <div className="flex justify-between pt-4">
            <Button onClick={onPreviousStep} disabled={isFirstStep || isLoading} variant="outline">
              Previous
            </Button>
            <Button onClick={onNextStep} disabled={isLoading} className="min-w-[100px]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLastStep ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
