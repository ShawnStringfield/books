import { type Highlight } from "@/app/stores/types";
import HighlightCard from "@/app/components/highlights/HighlightCard";
import { useBooks } from "@/app/hooks/books/useBooks";
import { enrichHighlights } from "@/app/utils/highlightUtils";

interface BookHighlightsSummaryProps {
  highlights: Highlight[];
  onToggleFavorite: (highlight: { id: string; isFavorite: boolean }) => void;
  onEdit: (highlight: { id: string; text: string }) => void;
  onSave: (highlight: { id: string }) => void;
  onCancel: () => void;
  onDelete: (highlightId: string) => void;
  onShowDeleteConfirm: (highlightId: string | null) => void;
  onViewAll: () => void;
  editingHighlightId: string | null;
  editedText: string;
  highlightToDelete: string | null;
  onTextChange: (text: string) => void;
  isDeleting: boolean;
  isUpdating: boolean;
}

export function BookHighlightsSummary({
  highlights,
  onToggleFavorite,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onShowDeleteConfirm,
  onViewAll,
  editingHighlightId,
  editedText,
  highlightToDelete,
  onTextChange,
  isDeleting,
  isUpdating,
}: BookHighlightsSummaryProps) {
  const { data: books = [] } = useBooks();

  if (highlights.length === 0) return null;

  const enrichedHighlights = enrichHighlights(highlights, books);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Highlights</h3>
        <button
          onClick={onViewAll}
          className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all
        </button>
      </div>
      <div className="space-y-3">
        {enrichedHighlights.slice(0, 3).map((highlight) => (
          <HighlightCard
            key={highlight.id}
            highlight={highlight}
            isEditing={editingHighlightId === highlight.id}
            editedText={
              editingHighlightId === highlight.id ? editedText : highlight.text
            }
            showDeleteConfirm={highlightToDelete === highlight.id}
            isDeleting={isDeleting}
            isUpdating={isUpdating}
            onToggleFavorite={() => onToggleFavorite(highlight)}
            onDelete={() => onDelete(highlight.id)}
            onEdit={() => onEdit(highlight)}
            onSave={() => onSave(highlight)}
            onCancel={onCancel}
            onTextChange={onTextChange}
            onShowDeleteConfirm={(show) =>
              onShowDeleteConfirm(show ? highlight.id : null)
            }
          />
        ))}
      </div>
    </div>
  );
}
