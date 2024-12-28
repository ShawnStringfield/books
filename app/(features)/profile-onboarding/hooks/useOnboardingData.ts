import { useMutation, useQuery } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase/firebase";
import { useToast } from "@/app/hooks/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import type { OnboardingData } from "@profile-onboarding/types/onboarding";

interface OnboardingDataResponse {
  success: boolean;
  data?: OnboardingData;
  error?: string;
}

export function useOnboardingData() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Query to fetch existing onboarding data
  const { data: existingData, isLoading: isLoadingData } = useQuery({
    queryKey: ["onboardingData", user?.uid],
    queryFn: async (): Promise<OnboardingData | null> => {
      if (!user) return null;

      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        selectedGenres: data.selectedGenres || [],
        bookGoals: data.bookGoals || { monthlyTarget: 2, yearlyTarget: 24 },
        readingSchedule: data.readingSchedule || { preferences: [] },
        isOnboardingComplete: data.isOnboardingComplete || false,
      };
    },
    enabled: !!user && !loading,
  });

  // Mutation to save onboarding data
  const { mutate: saveData, isPending: isSaving } = useMutation({
    mutationKey: ["saveOnboarding"],
    mutationFn: async (
      data: OnboardingData,
    ): Promise<OnboardingDataResponse> => {
      if (!user) {
        throw new Error("You must be logged in to complete onboarding");
      }

      try {
        const userRef = doc(db, "users", user.uid);

        // Create a complete user document to ensure all fields are set
        const completeUserData = {
          selectedGenres: data.selectedGenres || [],
          bookGoals: data.bookGoals || { monthlyTarget: 2, yearlyTarget: 24 },
          readingSchedule: data.readingSchedule || { preferences: [] },
          isOnboardingComplete: true, // Explicitly set to true
          updatedAt: new Date().toISOString(),
        };

        // Use set instead of setDoc with merge to ensure complete document update
        await setDoc(userRef, completeUserData);

        return {
          success: true,
          data: completeUserData,
        };
      } catch (error) {
        console.error("Error saving onboarding data:", error);
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to save onboarding data",
        };
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        console.log(
          "Onboarding completed successfully, preparing for dashboard redirect",
        );
        toast({
          title: "Profile Complete!",
          description: "Welcome to BookBuddy. Redirecting to your dashboard...",
        });

        // Increase timeout and add error boundary
        setTimeout(() => {
          console.log("Attempting dashboard redirect...");
          try {
            router.push("/dashboard");
          } catch (error) {
            console.error("Dashboard redirect failed:", error);
            // Fallback to window.location if router fails
            window.location.href = "/dashboard";
          }
        }, 2000); // Increased timeout to ensure Firestore write is complete
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to complete profile setup. Please try again.",
        variant: "destructive",
      });

      if (error.message.includes("logged in")) {
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    },
  });

  return {
    existingData,
    isLoadingData: isLoadingData || loading,
    saveData,
    isSaving,
  };
}
