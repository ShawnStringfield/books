import type { Meta, StoryObj } from "@storybook/react";
import BookDetailsSheet from "./BookDetailsSheet";
import { Book, ReadingStatus } from "@/app/stores/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { User } from "firebase/auth";
import { AuthContext } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";

// Create a client with mock defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      // Disable actual queries and return empty data
      queryFn: () => Promise.resolve([]),
    },
    mutations: {
      retry: false,
      // Make mutations no-ops
      mutationFn: () => Promise.resolve(),
    },
  },
});

// Mock data
const mockBook: Book = {
  id: "1",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  currentPage: 100,
  totalPages: 180,
  status: ReadingStatus.IN_PROGRESS,
  coverUrl: undefined,
  startDate: new Date("2024-01-01").toISOString(),
  updatedAt: new Date("2024-01-15").toISOString(),
  createdAt: new Date("2024-01-01").toISOString(),
  fromGoogle: false,
  categories: [],
};

const mockBooks = [mockBook];

// Mock user data
const mockUser: User = {
  uid: "test-user-id",
  email: "test@example.com",
  displayName: "Test User",
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  phoneNumber: null,
  photoURL: null,
  providerData: [],
  providerId: "firebase",
  refreshToken: "",
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => "mock-token",
  getIdTokenResult: async () => ({
    token: "mock-token",
    signInProvider: "password",
    signInSecondFactor: null,
    claims: {},
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    expirationTime: new Date().toISOString(),
  }),
  reload: async () => {},
  toJSON: () => ({}),
};

// Mock auth context value
const mockAuth = {
  user: mockUser,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  signInWithGoogle: async () => {},
  resetPassword: async () => {},
};

const meta: Meta<typeof BookDetailsSheet> = {
  title: "Components/Book/BookDetailsSheet",
  component: BookDetailsSheet,
  decorators: [
    (Story) => (
      <AuthContext.Provider value={mockAuth}>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-background text-foreground antialiased">
            <Story />
          </div>
        </QueryClientProvider>
      </AuthContext.Provider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BookDetailsSheet>;

// Pre-populate query cache with mock data
queryClient.setQueryData(["highlights", "book", mockBook.id], []);
queryClient.setQueryData(["books"], mockBooks);
queryClient.setQueryData(["books", mockBook.id], mockBook);

export const Default: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <BookDetailsSheet book={mockBook} books={mockBooks}>
        <Button variant="outline">View Book Details</Button>
      </BookDetailsSheet>
    </div>
  ),
};

export const JustStarted: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <BookDetailsSheet
        book={{
          ...mockBook,
          currentPage: 1,
          status: ReadingStatus.NOT_STARTED,
        }}
        books={mockBooks}
      >
        <Button variant="outline">View Book Details</Button>
      </BookDetailsSheet>
    </div>
  ),
};

export const Completed: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <BookDetailsSheet
        book={{
          ...mockBook,
          currentPage: 180,
          status: ReadingStatus.COMPLETED,
          completedDate: new Date("2024-01-15").toISOString(),
        }}
        books={mockBooks}
      >
        <Button variant="outline">View Book Details</Button>
      </BookDetailsSheet>
    </div>
  ),
};

export const GoogleBook: Story = {
  render: () => (
    <div className="flex h-screen items-center justify-center">
      <BookDetailsSheet
        book={{
          ...mockBook,
          fromGoogle: true,
          isbn: "abc123",
        }}
        books={mockBooks}
      >
        <Button variant="outline">View Book Details</Button>
      </BookDetailsSheet>
    </div>
  ),
};
