import { useReadingGoalsQuery } from "@/app/(features)/settings/hooks/useReadingGoalsQuery";

export function useBookGoals() {
  return useReadingGoalsQuery();
}
