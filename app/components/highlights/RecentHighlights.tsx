"use client";

import React, { useState } from "react";
import {
  useHighlights,
  useToggleFavorite,
  useDeleteHighlight,
  useUpdateHighlight,
} from "@/app/hooks/highlights/useHighlights";
import { Loader2, Highlighter } from "lucide-react";
import HighlightCard from "./HighlightCard";
import { useBooks } from "@/app/hooks/books/useBooks";
import { enrichHighlights } from "@/app/utils/highlightUtils";

interface RecentHighlightsProps {
  limit?: number;
}

interface HighlightState {
  isEditing: boolean;
  editedText: string;
  showDeleteConfirm: boolean;
}

export default function RecentHighlights({ limit = 5 }: RecentHighlightsProps) {
  const { data: highlights, isLoading: isHighlightsLoading } = useHighlights();
  const { data: books = [], isLoading: isBooksLoading } = useBooks();
  const toggleFavorite = useToggleFavorite();
  const deleteHighlight = useDeleteHighlight();
  const updateHighlight = useUpdateHighlight();
  const [highlightStates, setHighlightStates] = useState<
    Record<string, HighlightState>
  >({});

  const getHighlightState = (highlightId: string): HighlightState => {
    return (
      highlightStates[highlightId] || {
        isEditing: false,
        editedText: "",
        showDeleteConfirm: false,
      }
    );
  };

  const updateHighlightState = (
    highlightId: string,
    updates: Partial<HighlightState>
  ) => {
    setHighlightStates((prev) => ({
      ...prev,
      [highlightId]: {
        ...getHighlightState(highlightId),
        ...updates,
      },
    }));
  };

  if (isHighlightsLoading || isBooksLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const recentHighlights = enrichHighlights(
    highlights?.slice(0, limit) ?? [],
    books
  );

  if (recentHighlights.length === 0) {
    return (
      <div className="group rounded-lg border border-mono-subtle/40 bg-white p-2 shadow-sm transition-shadow hover:shadow-md h-[350px] flex flex-col justify-center">
        <div className="text-center space-y-4">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <Highlighter className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recent Highlights</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              No highlights yet. Start reading and highlighting to see them
              here!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Recent Highlights</h2>
      </div>
      <div className="space-y-4">
        {recentHighlights.map((highlight) => {
          const state = getHighlightState(highlight.id);
          return (
            <HighlightCard
              key={highlight.id}
              highlight={highlight}
              isEditing={state.isEditing}
              editedText={state.editedText || highlight.text}
              showDeleteConfirm={state.showDeleteConfirm}
              isDeleting={deleteHighlight.isPending}
              isUpdating={updateHighlight.isPending}
              onToggleFavorite={() => {
                toggleFavorite.mutate({
                  highlightId: highlight.id,
                  isFavorite: !highlight.isFavorite,
                  bookId: highlight.bookId,
                });
              }}
              onDelete={() => deleteHighlight.mutate(highlight.id)}
              onEdit={() => {
                updateHighlightState(highlight.id, {
                  isEditing: true,
                  editedText: highlight.text,
                });
              }}
              onSave={() => {
                const state = getHighlightState(highlight.id);
                if (state.editedText.trim() !== highlight.text) {
                  updateHighlight.mutate({
                    highlightId: highlight.id,
                    updates: { text: state.editedText.trim() },
                  });
                }
                updateHighlightState(highlight.id, {
                  isEditing: false,
                });
              }}
              onCancel={() => {
                updateHighlightState(highlight.id, {
                  isEditing: false,
                  editedText: highlight.text,
                });
              }}
              onTextChange={(text) =>
                updateHighlightState(highlight.id, { editedText: text })
              }
              onShowDeleteConfirm={(show) =>
                updateHighlightState(highlight.id, {
                  showDeleteConfirm: show,
                })
              }
            />
          );
        })}
      </div>
    </div>
  );
}
