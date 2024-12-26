import {
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import ProfileOnboarding from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { STEPS } from "@profile-onboarding/constants";
import { useToast } from "@/app/hooks/ui/use-toast";
import { act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Mock Firebase
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
}));

// Mock Firebase Auth with inline user creation
jest.mock("firebase/auth", () => {
  const createMockUser = () => ({
    uid: "test-user-id",
    email: "test@example.com",
    displayName: "Test User",
    emailVerified: true,
    getIdToken: jest.fn().mockResolvedValue("mock-id-token"),
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    providerData: [],
    refreshToken: "mock-refresh-token",
    delete: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
  });

  const mockUser = createMockUser();

  return {
    getAuth: jest.fn(() => ({
      currentUser: mockUser,
    })),
    signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: mockUser }),
    createUserWithEmailAndPassword: jest
      .fn()
      .mockResolvedValue({ user: mockUser }),
    signOut: jest.fn().mockResolvedValue(undefined),
    onAuthStateChanged: jest.fn((auth, callback) => {
      callback(mockUser);
      return jest.fn(); // unsubscribe function
    }),
    GoogleAuthProvider: jest.fn(() => ({
      addScope: jest.fn(),
      setCustomParameters: jest.fn(),
    })),
    signInWithPopup: jest.fn().mockResolvedValue({ user: mockUser }),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  };
});

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
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

jest.mock("@/app/hooks/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

let queryClient: QueryClient;
let mockToast: jest.Mock;

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthProvider>
  );
};

describe("ProfileOnboarding", () => {
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

  it("renders progress wizard with correct steps", async () => {
    // Arrange
    render(
      <TestWrapper>
        <ProfileOnboarding />
      </TestWrapper>
    );

    // Wait for the component to be fully rendered
    await waitFor(() => {
      expect(screen.getByTestId("progress-wizard")).toBeInTheDocument();
    });

    // Assert
    // Check if all steps are rendered
    STEPS.forEach((step) => {
      const progressWizard = screen.getByTestId("progress-wizard");
      const stepElement = within(progressWizard).getByRole("button", {
        name: new RegExp(`${step}.*\\d/\\d`, "i"),
      });
      expect(stepElement).toBeInTheDocument();
    });

    // Check if the first step content is rendered initially
    expect(screen.getByTestId(`step-content-${STEPS[0]}`)).toBeInTheDocument();
  });
});

describe("Validation Rules", () => {
  it("genres step - requires at least one genre selected", async () => {
    // Arrange
    render(
      <TestWrapper>
        <ProfileOnboarding />
      </TestWrapper>
    );

    // Wait for the component to be fully rendered
    await waitFor(() => {
      expect(screen.getByTestId("progress-wizard")).toBeInTheDocument();
    });

    // Navigate to the genres step
    const nextButton = screen.getByRole("button", { name: /next/i });
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
      description: "Fill in all required information before proceeding.",
      variant: "destructive",
    });
  });

  it("goals step - requires monthly target greater than 0", async () => {
    // Arrange
    render(
      <TestWrapper>
        <ProfileOnboarding />
      </TestWrapper>
    );

    // Wait for the component to be fully rendered
    await waitFor(() => {
      expect(screen.getByTestId("progress-wizard")).toBeInTheDocument();
    });

    // Helper function to navigate to goals step
    const navigateToGoalsStep = async () => {
      const nextButton = screen.getByRole("button", { name: /next/i });
      // Navigate past initial step
      await act(async () => {
        fireEvent.click(nextButton);
      });
      // Complete genres step using data-testid instead of text content
      const genreButton = screen.getByTestId("genre-button-fiction");
      await act(async () => {
        fireEvent.click(genreButton);
      });
      // Wait for the genre to be selected
      await waitFor(() => {
        expect(genreButton).toHaveAttribute("aria-pressed", "true");
      });
      // Click next to go to goals step
      await act(async () => {
        fireEvent.click(nextButton);
      });
    };

    // Navigate to goals step
    await navigateToGoalsStep();

    // Wait for the goals step to be rendered
    await waitFor(() => {
      expect(
        screen.getByTestId(`step-content-${STEPS[2]}`)
      ).toBeInTheDocument();
    });

    // Test goals step validation
    const decreaseButton = screen.getByRole("button", {
      name: "Decrease monthly book target",
    });
    const nextButton = screen.getByRole("button", { name: /next/i });

    // Set target to 0 by clicking decrease button multiple times
    await act(async () => {
      // Initial value is 2, so click twice to get to 0
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
      description: "Fill in all required information before proceeding.",
      variant: "destructive",
    });
  });

  it("schedule step - requires at least one day selected with preferences", async () => {
    // Arrange
    render(
      <TestWrapper>
        <ProfileOnboarding />
      </TestWrapper>
    );

    // Wait for the component to be fully rendered
    await waitFor(() => {
      expect(screen.getByTestId("progress-wizard")).toBeInTheDocument();
    });

    // Get the step buttons from the progress wizard
    const progressWizard = screen.getByTestId("progress-wizard");
    const scheduleStepButton = within(progressWizard).getByRole("button", {
      name: /schedule.*\d\/\d/i,
    });

    // Click directly on the schedule step
    await act(async () => {
      fireEvent.click(scheduleStepButton);
    });

    // Now we can test the schedule step validation
    const nextButton = screen.getByRole("button", { name: /next/i });

    // Attempt to proceed without selecting any days
    await act(async () => {
      fireEvent.click(nextButton);
    });

    // Assert
    expect(mockToast).toHaveBeenCalledWith({
      title: expect.any(String),
      description: "Fill in all required information before proceeding.",
      variant: "destructive",
    });
  });
});

describe("State Management", () => {
  it("updates genres correctly when selected/deselected", () => {});
  it("updates goals when new targets are set", () => {});
  it("updates schedule preferences correctly", () => {});
  it("maintains state between step navigation", () => {});
});

describe("Completion Handler", () => {
  it("handles notification permission request when notifications enabled", () => {});
  it("saves reading schedule to localStorage when permissions granted", () => {});
  it("calls completeOnboarding and submits data on completion", () => {});
  it("handles notification permission errors gracefully", () => {});
});

describe("Component Memoization", () => {
  it("prevents unnecessary re-renders of step components", () => {});
  it("maintains stable references for callbacks", () => {});
  it("only updates step content when current step changes", () => {});
});
