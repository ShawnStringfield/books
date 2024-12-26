"use client";

import { Button } from "@/app/components/ui/button";
import { BookMarked, CheckCircle2 } from "lucide-react";
import { useSelectedGenres, useSettingsStore } from "../hooks/useSettingsStore";

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Thriller",
  "Biography",
  "Self-Help",
];

export function GenrePreferencesSection() {
  const selectedGenres = useSelectedGenres();
  const updateSelectedGenres = useSettingsStore(
    (state) => state.updateSelectedGenres
  );

  const handleGenreSelect = (genre: string) => {
    const newSelectedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    updateSelectedGenres(newSelectedGenres);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {GENRES.map((genre) => (
        <Button
          key={genre}
          role="button"
          variant={selectedGenres.includes(genre) ? "default" : "outline"}
          className="w-full h-auto py-4 px-6 text-left justify-start"
          onClick={() => handleGenreSelect(genre)}
          aria-label={`select ${genre}`}
          aria-pressed={selectedGenres.includes(genre)}
          data-testid={`genre-button-${genre.toLowerCase()}`}
        >
          <BookMarked className="w-5 h-5 mr-2" aria-hidden="true" />
          <span>{genre}</span>
          {selectedGenres.includes(genre) && (
            <div className="ml-auto" aria-hidden="true">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          )}
        </Button>
      ))}
    </div>
  );
}
