import { fireEvent, render, screen, within } from '@testing-library/react';
import ProfileOnboarding from './page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { STEPS } from '@profile-onboarding/constants';
import { useToast } from '@/app/hooks/use-toast';
import { act } from '@testing-library/react';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
    has: jest.fn(),
  })),
}));

jest.mock('../../hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

let queryClient: QueryClient;
let mockToast: jest.Mock;

describe('ProfileOnboarding', () => {
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders progress wizard with correct steps', () => {
    // Arrange
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileOnboarding />
      </QueryClientProvider>
    );

    // Assert
    // Check if all steps are rendered
    STEPS.forEach((step) => {
      const progressWizard = screen.getByTestId('progress-wizard');
      const stepElement = within(progressWizard).getByText(new RegExp(step, 'i'));
      expect(stepElement).toBeInTheDocument();
    });

    // Check if the first step content is rendered initially
    expect(screen.getByTestId(`step-content-${STEPS[0]}`)).toBeInTheDocument();
  });
});

describe('Validation Rules', () => {
  it('genres step - requires at least one genre selected', async () => {
    // Arrange
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileOnboarding />
      </QueryClientProvider>
    );

    // Navigate to the genres step
    const nextButton = screen.getByRole('button', { name: /next/i });
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // Attempt to proceed without selecting a genre
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // Assert - Check that the mock toast was called with correct params
    expect(mockToast).toHaveBeenCalledWith({
      title: expect.any(String),
      description: 'Fill in all required information before proceeding.',
      variant: 'destructive',
    });
  });

  it('goals step - requires monthly target greater than 0', async () => {
    // Arrange
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileOnboarding />
      </QueryClientProvider>
    );

    // Helper function to navigate to goals step
    const navigateToGoalsStep = async () => {
      const nextButton = screen.getByRole('button', { name: /next/i });
      // Navigate past initial step
      await act(async () => {
        fireEvent.click(nextButton);
      });
      // Complete genres step using data-testid instead of text content
      const genreButton = screen.getByTestId('genre-button-fiction');
      await act(async () => {
        fireEvent.click(genreButton);
        fireEvent.click(nextButton);
      });
    };

    // Navigate to goals step
    await navigateToGoalsStep();

    // Test goals step validation
    const decreaseButton = screen.getByRole('button', {
      name: /decrease monthly book target/i,
    });
    const nextButton = screen.getByRole('button', { name: /next/i });

    // Set target to 0
    await act(async () => {
      fireEvent.click(decreaseButton);
      fireEvent.click(decreaseButton);
    });

    // Attempt to proceed with invalid target
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // Assert
    expect(mockToast).toHaveBeenCalledWith({
      title: expect.any(String),
      description: 'Fill in all required information before proceeding.',
      variant: 'destructive',
    });
  });

  it('schedule step - requires at least one day selected with preferences', async () => {
    // Arrange
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileOnboarding />
      </QueryClientProvider>
    );

    // Get the step buttons from the progress wizard
    const progressWizard = screen.getByTestId('progress-wizard');
    const scheduleStepButton = within(progressWizard).getByText(/schedule/i);

    // Click directly on the schedule step
    await act(async () => {
      fireEvent.click(scheduleStepButton);
    });

    // Now we can test the schedule step validation
    const nextButton = screen.getByRole('button', { name: /next/i });

    // Attempt to proceed without selecting any days
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // Assert
    expect(mockToast).toHaveBeenCalledWith({
      title: expect.any(String),
      description: 'Fill in all required information before proceeding.',
      variant: 'destructive',
    });
  });
});

describe('State Management', () => {
  it('updates genres correctly when selected/deselected', () => {});
  it('updates goals when new targets are set', () => {});
  it('updates schedule preferences correctly', () => {});
  it('maintains state between step navigation', () => {});
});

describe('Completion Handler', () => {
  it('handles notification permission request when notifications enabled', () => {});
  it('saves reading schedule to localStorage when permissions granted', () => {});
  it('calls completeOnboarding and submits data on completion', () => {});
  it('handles notification permission errors gracefully', () => {});
});

describe('Component Memoization', () => {
  it('prevents unnecessary re-renders of step components', () => {});
  it('maintains stable references for callbacks', () => {});
  it('only updates step content when current step changes', () => {});
});
