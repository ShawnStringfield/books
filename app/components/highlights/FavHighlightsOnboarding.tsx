import { Button } from "@/app/components/ui/button";
import { Heart } from "lucide-react";
import {
  useBookStore,
  selectFavoriteHighlights,
} from "@/app/stores/useBookStore";
import { useEffect, useState } from "react";
import HighlightCard from "./HighlightCard";
import type { Book, Highlight, EnrichedHighlight } from "@/app/stores/types";

const FavHighlightsOnboarding = ({ className }: { className?: string }) => {
  const [favoriteHighlights, setFavoriteHighlights] = useState<Highlight[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Initial load
    const state = useBookStore.getState();
    setFavoriteHighlights(selectFavoriteHighlights(state));
    setBooks(state.books);

    // Subscribe to changes
    const unsubscribe = useBookStore.subscribe((state) => {
      setFavoriteHighlights(selectFavoriteHighlights(state));
      setBooks(state.books);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleFavorite = async (highlight: Highlight) => {
    setIsUpdating(true);
    try {
      // TODO: Implement toggle favorite logic with your store
      setIsUpdating(false);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      setIsUpdating(false);
    }
  };

  const handleDelete = async (highlight: Highlight) => {
    setIsDeleting(true);
    try {
      // TODO: Implement delete logic with your store
      setIsDeleting(false);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete highlight:", error);
      setIsDeleting(false);
    }
  };

  const handleEdit = (highlight: Highlight) => {
    setEditingId(highlight.id);
    setEditedText(highlight.text);
  };

  const handleSave = async (highlight: Highlight) => {
    setIsUpdating(true);
    try {
      // TODO: Implement save logic with your store
      setIsUpdating(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save highlight:", error);
      setIsUpdating(false);
    }
  };

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
            {favoriteHighlights.slice(0, 3).map((highlight: Highlight) => {
              const book = books.find((b: Book) => b.id === highlight.bookId);
              const enrichedHighlight: EnrichedHighlight = {
                ...highlight,
                bookTitle: book?.title || "",
                bookAuthor: book?.author || "",
                bookTotalPages: book?.totalPages || 0,
                bookCurrentPage: book?.currentPage || 0,
                readingProgress: book
                  ? Math.round((book.currentPage / book.totalPages) * 100)
                  : 0,
              };
              return (
                <HighlightCard
                  key={highlight.id}
                  highlight={enrichedHighlight}
                  isEditing={editingId === highlight.id}
                  editedText={
                    editingId === highlight.id ? editedText : highlight.text
                  }
                  showDeleteConfirm={showDeleteConfirm === highlight.id}
                  isDeleting={isDeleting && showDeleteConfirm === highlight.id}
                  isUpdating={isUpdating && editingId === highlight.id}
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
              );
            })}
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
