import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserSettings,
  updateUserSettings,
} from "@/app/lib/firebase/services/settings";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";

export function useGenrePreferencesQuery() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: selectedGenres = [], isLoading } = useQuery({
    queryKey: ["settings", "genres", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const settings = await getUserSettings(user.uid);
      return settings?.selectedGenres ?? [];
    },
    enabled: !!user,
  });

  const { mutate: updateGenres } = useMutation({
    mutationFn: async (newGenres: string[]) => {
      if (!user) throw new Error("User not authenticated");
      await updateUserSettings(user.uid, {
        selectedGenres: newGenres,
      });
    },
    onSuccess: (_, newGenres) => {
      queryClient.setQueryData(["settings", "genres", user?.uid], newGenres);
    },
    onError: (error) => {
      console.error("Error updating genre preferences:", error);
      toast.error("Failed to save genre preferences");
    },
  });

  return {
    selectedGenres,
    isLoading,
    updateGenres,
  };
}
