import { Button } from "@/app/components/ui/button";
import { Heart } from "lucide-react";
import {
  useToggleFavorite,
  useDeleteHighlight,
  useUpdateHighlight,
  useFavoriteHighlights,
} from "@/app/hooks/highlights/useHighlights";
import { useState } from "react";
import HighlightCard from "./HighlightCard";
import type { Highlight, EnrichedHighlight } from "@/app/stores/types";

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

const FavHighlightsOnboarding = ({ className }: { className?: string }) => {
  const { data: favoriteHighlights = [], isLoading } = useFavoriteHighlights();
  const toggleFavorite = useToggleFavorite();
  const deleteHighlight = useDeleteHighlight();
  const updateHighlight = useUpdateHighlight();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  const handleToggleFavorite = async (highlight: Highlight) => {
    toggleFavorite.mutate({
      highlightId: highlight.id,
      isFavorite: !highlight.isFavorite,
      bookId: highlight.bookId,
    });
  };

  const handleDelete = async (highlight: Highlight) => {
    deleteHighlight.mutate(highlight.id);
    setShowDeleteConfirm(null);
  };

  const handleEdit = (highlight: Highlight) => {
    setEditingId(highlight.id);
    setEditedText(highlight.text);
  };

  const handleSave = async (highlight: Highlight) => {
    if (editedText.trim() !== highlight.text) {
      updateHighlight.mutate({
        highlightId: highlight.id,
        updates: { text: editedText.trim() },
      });
    }
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div
        className={`${className || ""} flex justify-center items-center py-8`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className={`${className || ""}`}>
      {favoriteHighlights.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Favorite Highlights
            </h2>
            <span className="text-sm text-gray-500">
              {favoriteHighlights.length} total
            </span>
          </div>
          <div className="space-y-4">
            {favoriteHighlights.slice(0, 3).map((highlight) => (
              <HighlightCard
                key={highlight.id}
                highlight={enrichHighlight(highlight)}
                isEditing={editingId === highlight.id}
                editedText={
                  editingId === highlight.id ? editedText : highlight.text
                }
                showDeleteConfirm={showDeleteConfirm === highlight.id}
                isDeleting={
                  deleteHighlight.isPending &&
                  showDeleteConfirm === highlight.id
                }
                isUpdating={
                  (updateHighlight.isPending || toggleFavorite.isPending) &&
                  editingId === highlight.id
                }
                onToggleFavorite={() => handleToggleFavorite(highlight)}
                onDelete={() => handleDelete(highlight)}
                onEdit={() => handleEdit(highlight)}
                onSave={() => handleSave(highlight)}
                onCancel={() => setEditingId(null)}
                onTextChange={setEditedText}
                onShowDeleteConfirm={(show) =>
                  setShowDeleteConfirm(show ? highlight.id : null)
                }
              />
            ))}
            {favoriteHighlights.length > 3 && (
              <Button
                variant="outline"
                className="w-full text-sm font-medium text-gray-700 hover:bg-gray-50"
                aria-label={`View all ${favoriteHighlights.length} favorite highlights`}
              >
                View all favorites
              </Button>
            )}
          </div>
        </div>
      ) : (
        <EmptyFavoritesState />
      )}
    </div>
  );
};

function EmptyFavoritesState() {
  return (
    <div className="group rounded-lg border border-mono-subtle/40 bg-white p-2 shadow-sm transition-shadow hover:shadow-md h-[350px] flex flex-col justify-center">
      <div className="text-center space-y-4">
        <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-6 h-6 text-red-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Save Your Favorite Highlights
          </h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            Mark highlights as favorites while reading to keep your most
            meaningful quotes and insights in one place.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FavHighlightsOnboarding;
