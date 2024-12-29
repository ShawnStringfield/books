"use client";

import { useState } from "react";
import {
  useHighlightsByBook,
  useDeleteHighlight,
  useUpdateHighlight,
  useToggleFavorite,
} from "@/app/hooks/highlights/useHighlights";
import HighlightCard from "./HighlightCard";
import { Highlighter } from "lucide-react";
import type { Highlight, EnrichedHighlight } from "@/app/stores/types";

interface HighlightsListProps {
  bookId: string;
  limit?: number;
}

function EmptyHighlightState() {
  return (
    <div className="text-center py-8">
      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <Highlighter className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Highlights Yet</h3>
      <p className="text-sm text-gray-600">
        Start capturing your favorite moments from this book.
      </p>
    </div>
  );
}

interface HighlightState {
  isEditing: boolean;
  editedText: string;
  showDeleteConfirm: boolean;
}

const enrichHighlight = (highlight: Highlight): EnrichedHighlight => {
  return {
    ...highlight,
    bookTitle: "Untitled", // These would ideally come from a book lookup
    bookAuthor: "Unknown Author",
    bookCurrentPage: highlight.page,
    bookTotalPages: highlight.page,
    readingProgress: 0,
  };
};

const HighlightsList = ({ bookId, limit }: HighlightsListProps) => {
  const { data: highlights = [], isLoading } = useHighlightsByBook(
    bookId,
    limit,
  );
  const toggleFavorite = useToggleFavorite();
  const deleteHighlight = useDeleteHighlight();
  const updateHighlight = useUpdateHighlight();

  // Track state for each highlight by ID
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
    updates: Partial<HighlightState>,
  ) => {
    setHighlightStates((prev) => ({
      ...prev,
      [highlightId]: {
        ...getHighlightState(highlightId),
        ...updates,
      },
    }));
  };

  const handleToggleFavorite = (highlight: Highlight) => {
    toggleFavorite.mutate({
      highlightId: highlight.id,
      isFavorite: !highlight.isFavorite,
      bookId: bookId,
    });
  };

  const handleDelete = (highlightId: string) => {
    deleteHighlight.mutate(highlightId);
  };

  const handleEdit = (highlight: Highlight) => {
    updateHighlightState(highlight.id, {
      isEditing: true,
      editedText: highlight.text,
    });
  };

  const handleSave = (highlight: Highlight) => {
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
  };

  const handleCancel = (highlight: Highlight) => {
    updateHighlightState(highlight.id, {
      isEditing: false,
      editedText: highlight.text,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (highlights.length === 0) {
    return <EmptyHighlightState />;
  }

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-tight text-slate-500">
          {limit
            ? `Recent Highlights (${highlights.length})`
            : `Highlights (${highlights.length})`}
        </h2>
        <div className="grid gap-4">
          {highlights.map((highlight) => {
            const state = getHighlightState(highlight.id);
            return (
              <HighlightCard
                key={highlight.id}
                highlight={enrichHighlight(highlight)}
                isEditing={state.isEditing}
                editedText={state.editedText || highlight.text}
                showDeleteConfirm={state.showDeleteConfirm}
                isDeleting={deleteHighlight.isPending}
                isUpdating={
                  updateHighlight.isPending || toggleFavorite.isPending
                }
                showBookTitle={false}
                onToggleFavorite={() => handleToggleFavorite(highlight)}
                onDelete={() => handleDelete(highlight.id)}
                onEdit={() => handleEdit(highlight)}
                onSave={() => handleSave(highlight)}
                onCancel={() => handleCancel(highlight)}
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
    </div>
  );
};

export default HighlightsList;
