import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressSteps } from './ProgressSteps';
import { STEPS } from '@profile-onboarding/constants';

describe('ProgressSteps Component', () => {
  const mockOnStepClick = jest.fn();
  const defaultProps = {
    steps: STEPS,
    currentStep: STEPS[1],
    completedSteps: [STEPS[0]],
    onStepClick: mockOnStepClick,
  };

  const mockSteps = ['personal', 'contact', 'review'] as const;

  beforeEach(() => {
    mockOnStepClick.mockClear();
  });

  it('renders all steps', () => {
    render(<ProgressSteps {...defaultProps} />);
    defaultProps.steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument();
    });
  });

  it('calls onStepClick with correct step when a step is clicked', () => {
    render(<ProgressSteps {...defaultProps} />);
    const stepButton = screen.getByText(defaultProps.steps[1]);
    fireEvent.click(stepButton);
    expect(mockOnStepClick).toHaveBeenCalledWith(defaultProps.steps[1]);
  });

  it('displays check icon only for completed steps that are not current', () => {
    // First render
    const { unmount } = render(<ProgressSteps {...defaultProps} />);

    // Check first assertion
    const completedStep = screen.getByText(STEPS[0]).closest('button');
    expect(completedStep?.querySelector('svg')).toBeInTheDocument();

    // Cleanup previous render
    unmount();

    // Second render with new props
    render(<ProgressSteps {...defaultProps} currentStep={STEPS[0]} completedSteps={[STEPS[0]]} />);
    const currentStep = screen.getByText(STEPS[0]).closest('button');
    expect(currentStep?.querySelector('svg')).not.toBeInTheDocument();
  });

  it('handles step clicks correctly', () => {
    render(<ProgressSteps steps={[...mockSteps]} currentStep="contact" completedSteps={['personal']} onStepClick={mockOnStepClick} />);

    // Click on a completed step
    fireEvent.click(screen.getByText('personal'));
    expect(mockOnStepClick).toHaveBeenCalledWith('personal');
  });
});
