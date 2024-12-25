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
import {
  useHighlights,
  useFavoriteHighlights,
} from "@/app/hooks/highlights/useHighlights";

export default function DashboardPage() {
  useOnboardingCheck();
  const { data: books, isLoading: isBooksLoading } = useBooks();
  const { data: highlights = [], isLoading: isHighlightsLoading } =
    useHighlights();
  const { data: favoriteHighlights = [], isLoading: isFavoritesLoading } =
    useFavoriteHighlights();

  if (isBooksLoading || isHighlightsLoading || isFavoritesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const currentlyReadingBooks =
    books?.filter((book) => book.status === ReadingStatus.IN_PROGRESS) ?? [];
  const bothEmpty = highlights.length === 0 && favoriteHighlights.length === 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <DashboardStats />
        </div>
        <div className="mb-8">
          <CurrentlyReading books={currentlyReadingBooks} />
        </div>
        <div
          className={
            bothEmpty
              ? "grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
              : "space-y-6"
          }
        >
          <RecentHighlights limit={5} />
          <FavHighlightsOnboarding />
        </div>
      </div>
    </DashboardLayout>
  );
}
