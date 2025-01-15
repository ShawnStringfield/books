"use client";

import { Card } from "@/app/components/ui/card";
import { ReadingGoalsSection } from "./ReadingGoalsSection";
import { GenrePreferencesSection } from "./GenrePreferencesSection";

export function SettingsContent() {
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
