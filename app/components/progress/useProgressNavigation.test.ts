import { act, renderHook } from '@testing-library/react';
import { useProgressNavigation } from './useProgressNavigation';
import { useToast } from '@/app/hooks/use-toast';

jest.mock('../../hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('useProgressNavigation', () => {
  // Define our test types
  type TestStep = 'step1' | 'step2' | 'step3';
  interface TestState {
    currentStep: TestStep;
  }

  // Setup default test props
  const defaultProps = {
    steps: ['step1', 'step2', 'step3'] as TestStep[],
    getCurrentState: () => ({ currentStep: 'step1' } as TestState),
  };

  let mockToast: jest.Mock;

  beforeEach(() => {
    // Create a new mock function for each test
    mockToast = jest.fn();
    // Setup the mock implementation
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });
  });

  it('should return correct initial state values', () => {
    const { result } = renderHook(() => useProgressNavigation(defaultProps));

    expect(result.current).toEqual({
      currentStep: 'step1',
      handleStepChange: expect.any(Function),
      handleNextStep: expect.any(Function),
      handlePreviousStep: expect.any(Function),
      isFirstStep: true,
      isLastStep: false,
    });
  });

  it('should correctly identify middle step', () => {
    const middleStepProps = {
      ...defaultProps,
      getCurrentState: () => ({ currentStep: 'step2' } as TestState),
    };

    const { result } = renderHook(() => useProgressNavigation(middleStepProps));

    expect(result.current).toEqual({
      currentStep: 'step2',
      handleStepChange: expect.any(Function),
      handleNextStep: expect.any(Function),
      handlePreviousStep: expect.any(Function),
      isFirstStep: false,
      isLastStep: false,
    });
  });

  it('should correctly identify last step', () => {
    const lastStepProps = {
      ...defaultProps,
      getCurrentState: () => ({ currentStep: 'step3' } as TestState),
    };

    const { result } = renderHook(() => useProgressNavigation(lastStepProps));

    expect(result.current).toEqual({
      currentStep: 'step3',
      handleStepChange: expect.any(Function),
      handleNextStep: expect.any(Function),
      handlePreviousStep: expect.any(Function),
      isFirstStep: false,
      isLastStep: true,
    });
  });

  it('should prevent navigation when validation fails', () => {
    const mockToast = jest.fn();

    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });

    const validationProps = {
      ...defaultProps,
      validationRules: {
        step1: () => false, // Always fail validation
      },
    };

    const { result } = renderHook(() => useProgressNavigation(validationProps));

    act(() => {
      result.current.handleNextStep();
    });

    // Should show error toast
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Please complete this step',
      description: 'Fill in all required information before proceeding.',
      variant: 'destructive',
    });
  });

  it('should allow navigation when validation passes', () => {
    const onStepChangeMock = jest.fn();
    const validationProps = {
      ...defaultProps,
      validationRules: {
        step1: () => true, // Always pass validation
      },
      onStepChange: onStepChangeMock,
    };

    const { result } = renderHook(() => useProgressNavigation(validationProps));

    act(() => {
      result.current.handleNextStep();
    });

    // Verify no toast was shown
    expect(mockToast).not.toHaveBeenCalled();
    // Verify navigation occurred
    expect(onStepChangeMock).toHaveBeenCalledWith('step2');
  });

  it('should prevent skipping steps', () => {
    const onStepChangeMock = jest.fn();
    const props = {
      ...defaultProps,
      onStepChange: onStepChangeMock,
    };

    const { result } = renderHook(() => useProgressNavigation(props));

    act(() => {
      result.current.handleStepChange('step3');
    });

    expect(onStepChangeMock).not.toHaveBeenCalled();
  });

  it('should handle edge cases for next/previous navigation', () => {
    const onStepChangeMock = jest.fn();
    const lastStepProps = {
      ...defaultProps,
      getCurrentState: () => ({ currentStep: 'step3' } as TestState),
      onStepChange: onStepChangeMock,
    };

    const { result } = renderHook(() => useProgressNavigation(lastStepProps));

    act(() => {
      result.current.handleNextStep();
    });
    expect(onStepChangeMock).not.toHaveBeenCalled();

    onStepChangeMock.mockReset();

    const firstStepProps = {
      ...defaultProps,
      onStepChange: onStepChangeMock,
    };

    const { result: firstStepResult } = renderHook(() => useProgressNavigation(firstStepProps));

    act(() => {
      firstStepResult.current.handlePreviousStep();
    });
    expect(onStepChangeMock).not.toHaveBeenCalled();
  });

  it('should handle valid next/previous navigation between steps', () => {
    const onStepChangeMock = jest.fn();
    const props = {
      ...defaultProps,
      getCurrentState: () => ({ currentStep: 'step2' } as TestState),
      onStepChange: onStepChangeMock,
    };

    const { result } = renderHook(() => useProgressNavigation(props));

    // Test next navigation
    act(() => {
      result.current.handleNextStep();
    });
    expect(onStepChangeMock).toHaveBeenCalledWith('step3');

    // Test previous navigation
    act(() => {
      result.current.handlePreviousStep();
    });
    expect(onStepChangeMock).toHaveBeenCalledWith('step1');
  });
});
