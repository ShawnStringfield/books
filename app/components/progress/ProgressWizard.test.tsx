import { StepId } from '@/app/(features)/profile-onboarding/types/onboarding';
import { render, screen } from '@testing-library/react';
import { ProgressWizard } from './ProgressWizard';

describe('ProgressWizard', () => {
  const defaultProps = {
    progress: 50,
    steps: ['Step 1', 'Step 2', 'Step 3'],
    currentStep: 'step2' as StepId,
    completedSteps: ['step1'] as StepId[],
    onStepChange: jest.fn(),
    isFirstStep: false,
    isLastStep: false,
    onPreviousStep: jest.fn(),
    onNextStep: jest.fn(),
    children: <div>Test Content</div>,
  };

  it('renders all components correctly', () => {
    render(<ProgressWizard {...defaultProps} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables back button on first step', () => {
    render(<ProgressWizard {...defaultProps} isFirstStep={true} />);
    expect(screen.getByText('Back')).toBeDisabled();
  });

  it('hides next button on last step', () => {
    render(<ProgressWizard {...defaultProps} isLastStep={true} />);
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });
});
