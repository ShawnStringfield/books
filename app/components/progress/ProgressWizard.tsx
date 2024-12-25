import { ReactNode } from "react";
import { Button } from "@/app/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { ProgressSteps } from "./ProgressSteps";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col" data-testid="progress-wizard">
      <div className="w-full bg-background sticky top-0 z-10">
        <div className="h-1">
          <ProgressBar value={progress} variant="bleed" />
        </div>
      </div>

      <div className="flex-1 container px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-4 sm:py-6 lg:py-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="px-0 sm:px-4">
            <ProgressSteps
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={onStepChange}
            />
          </div>

          <div className="bg-card rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 border border-border/5">
            {children}
          </div>

          {!isLastStep && (
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 px-0 sm:px-4">
              {!isFirstStep && (
                <Button
                  onClick={onPreviousStep}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full sm:w-auto min-w-[100px]"
                >
                  Previous
                </Button>
              )}
              <Button
                onClick={onNextStep}
                disabled={isLoading}
                className="w-full sm:w-auto min-w-[100px]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
