import { useMutation, useQuery } from "@tanstack/react-query";
import { saveOnboardingData } from "@profile-onboarding/actions/onboardingServerActions";
import type { OnboardingData } from "@profile-onboarding/types/onboarding";
import { useToast } from "@/app/hooks/ui/use-toast";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

interface OnboardingResponse {
  success: boolean;
  data?: OnboardingData;
  error?: string;
}

export function useOnboardingMutation() {
  const { toast } = useToast();
  const router = useRouter();

  // Query to fetch existing data
  const { data: existingData, isLoading: isLoadingData } = useQuery({
    queryKey: ["onboardingData"],
    queryFn: async (): Promise<OnboardingResponse | null> => {
      const user = auth.currentUser;
      if (!user) return null;

      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) return null;

      const data = snapshot.data() as OnboardingData;
      return {
        success: true,
        data,
      };
    },
    enabled: !!auth.currentUser,
  });

  // Mutation to save data
  const mutation = useMutation<OnboardingResponse, Error, OnboardingData>({
    mutationKey: ["saveOnboarding"],
    mutationFn: async (data: OnboardingData) => {
      console.log("Starting onboarding mutation with data:", data);

      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error("You must be logged in to complete onboarding");
      }

      const result = await saveOnboardingData(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      console.log("Onboarding data saved successfully:", result);
      return result;
    },
    onSuccess: () => {
      console.log("Mutation successful, preparing to redirect...");
      toast({
        title: "Profile Complete!",
        description: "Welcome to BookBuddy. Redirecting to your dashboard...",
      });

      // Add a small delay to ensure state is saved
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    },
    onError: (error: Error) => {
      console.error("Onboarding mutation error:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to complete profile setup. Please try again.",
        variant: "destructive",
      });

      // If the error is auth-related, redirect to login
      if (error.message.includes("logged in")) {
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    existingData,
    isLoadingData,
  };
}
