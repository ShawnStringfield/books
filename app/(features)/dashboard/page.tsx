"use client";

import React from "react";
import { useOnboardingCheck } from "@/app/(features)/profile-onboarding/hooks/useOnboardingCheck";
import CurrentlyReading from "@/app/components/book/CurrentlyReading";
import FavHighlightsOnboarding from "@/app/components/highlights/FavHighlightsOnboarding";
import RecentHighlights from "@/app/components/highlights/RecentHighlights";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import DashboardStats from "@/app/components/dashboard/stats/DashboardStats";
import { useBooks } from "@/app/hooks/books/useBooks";
import { ReadingStatus } from "@/app/stores/types";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  useOnboardingCheck();
  const { data: books, isLoading } = useBooks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const currentlyReadingBooks =
    books?.filter((book) => book.status === ReadingStatus.IN_PROGRESS) ?? [];
  const hasRecentHighlights = false; // TODO: Implement with Firebase
  const hasFavoriteHighlights = false; // TODO: Implement with Firebase
  const bothEmpty = !hasRecentHighlights && !hasFavoriteHighlights;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <DashboardStats />
        </div>
        <div className="mb-8">
          <CurrentlyReading books={currentlyReadingBooks} />
        </div>
        <div className="space-y-6">
          <RecentHighlights limit={5} />
          <FavHighlightsOnboarding />
        </div>
      </div>
    </DashboardLayout>
  );
}
