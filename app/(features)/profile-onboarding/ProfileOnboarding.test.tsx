import { render } from '@testing-library/react';
import ProfileOnboarding from '../profile-onboarding/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a mock for next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      pathname: '/',
      // Add other router methods you use
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

describe('ProfileOnboarding', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
      },
    });
  });

  it('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileOnboarding />
      </QueryClientProvider>
    );
    // Your test assertions here
  });
});
