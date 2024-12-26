import { useReadingGoals } from "@/app/(features)/dashboard/settings/hooks/useSettingsStore";

export function useBookGoals() {
  return useReadingGoals();
}
