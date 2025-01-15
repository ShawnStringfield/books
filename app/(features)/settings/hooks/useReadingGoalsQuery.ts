import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserSettings,
  updateReadingGoals,
  type ReadingGoals,
} from "@/app/lib/firebase/services/settings";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";

const DEFAULT_GOALS: ReadingGoals = {
  monthlyTarget: 1,
  yearlyTarget: 12,
};

export function useReadingGoalsQuery() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: goals = DEFAULT_GOALS, isLoading } = useQuery({
    queryKey: ["settings", "readingGoals", user?.uid],
    queryFn: async () => {
      if (!user) return DEFAULT_GOALS;
      const settings = await getUserSettings(user.uid);
      return settings?.readingGoals ?? DEFAULT_GOALS;
    },
    enabled: !!user,
  });

  const { mutate: updateGoals, isPending } = useMutation({
    mutationFn: async (newGoals: ReadingGoals) => {
      if (!user) throw new Error("User not authenticated");
      await updateReadingGoals(user.uid, newGoals);
    },
    onMutate: async (newGoals) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["settings", "readingGoals", user?.uid],
      });

      // Snapshot the previous value
      const previousGoals = queryClient.getQueryData<ReadingGoals>([
        "settings",
        "readingGoals",
        user?.uid,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["settings", "readingGoals", user?.uid],
        newGoals,
      );

      // Return context with the previous value
      return { previousGoals };
    },
    onError: (error, newGoals, context) => {
      // Rollback to the previous value on error
      queryClient.setQueryData(
        ["settings", "readingGoals", user?.uid],
        context?.previousGoals,
      );
      console.error("Error updating reading goals:", error);
      toast.error("Failed to save reading goals. Please try again.");
    },
    onSuccess: () => {
      toast.success("Reading goals updated successfully");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["settings", "readingGoals", user?.uid],
      });
    },
  });

  return {
    goals,
    isLoading,
    isPending,
    updateGoals,
  };
}
