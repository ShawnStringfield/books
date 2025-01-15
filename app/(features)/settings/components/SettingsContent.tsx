"use client";

import { Card } from "@/app/components/ui/card";
import { ReadingGoalsSection } from "./ReadingGoalsSection";
import { GenrePreferencesSection } from "./GenrePreferencesSection";
import { useReadingGoalsQuery, useGenrePreferencesQuery } from "../hooks";
import { Loader2 } from "lucide-react";

export function SettingsContent() {
  const { isLoading: isLoadingGoals } = useReadingGoalsQuery();
  const { isLoading: isLoadingGenres } = useGenrePreferencesQuery();

  const isLoading = isLoadingGoals || isLoadingGenres;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Reading Goals</h2>
        <ReadingGoalsSection />
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Genre Preferences</h2>
        <GenrePreferencesSection />
      </Card>
    </div>
  );
}
