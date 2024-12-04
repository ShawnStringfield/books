import { StepId } from '@/app/(features)/profile-onboarding/types/onboarding';
import { ProgressBar } from './ProgressBar';
import { ProgressSteps } from './ProgressSteps';
import { Card, CardContent } from '../ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface ProgressWizardProps {
  progress: number;
  steps: string[];
  currentStep: StepId;
  completedSteps: StepId[];
  onStepChange: (step: StepId) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onPreviousStep: () => void;
  onNextStep: () => void;
  children: React.ReactNode;
}

export const ProgressWizard = ({
  progress,
  steps,
  currentStep,
  completedSteps,
  onStepChange,
  isFirstStep,
  isLastStep,
  onPreviousStep,
  onNextStep,
  children,
}: ProgressWizardProps) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 space-y-2" data-testid="progress-wizard">
          <ProgressBar value={progress} />
          <ProgressSteps steps={steps.map((step) => step)} currentStep={currentStep} completedSteps={completedSteps} onStepClick={onStepChange} />
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="p-8">
            {children}
            <div className="flex justify-between pt-6">
              <Button variant="ghost" onClick={onPreviousStep} disabled={isFirstStep} className="flex items-center">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {!isLastStep && (
                <Button onClick={onNextStep} className="flex items-center">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
