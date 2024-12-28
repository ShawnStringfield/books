import { useCallback } from "react";
import { useBookStore, type BookStore } from "@/app/stores/useBookStore";

export const useRecentHighlights = (limit: number = 5) => {
  return useBookStore(
    useCallback(
      (state: BookStore) => {
        const book = state.currentBook;
        if (!book?.highlights) return [];
        return book.highlights
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, limit);
      },
      [limit],
    ),
  );
};
