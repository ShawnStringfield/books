import React from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Heart, Trash2, Pencil, Check, X } from "lucide-react";
import type { EnrichedHighlight } from "@/app/stores/types";
import { formatDistanceToNow } from "date-fns";
import { DeleteConfirm } from "@/app/components/ui/delete-confirm";
import { useRouter } from "next/navigation";

interface HighlightCardProps {
  highlight: EnrichedHighlight;
  isEditing: boolean;
  editedText: string;
  showDeleteConfirm: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  showBookTitle?: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onTextChange: (text: string) => void;
  onShowDeleteConfirm: (show: boolean) => void;
}

export default function HighlightCard({
  highlight,
  isEditing,
  editedText,
  showDeleteConfirm,
  isDeleting,
  isUpdating,
  showBookTitle = true,
  onToggleFavorite,
  onDelete,
  onEdit,
  onSave,
  onCancel,
  onTextChange,
  onShowDeleteConfirm,
}: HighlightCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or textarea
    if (
      e.target instanceof Element &&
      (e.target.closest("button") || e.target.closest("textarea"))
    ) {
      return;
    }
    router.push(`/dashboard/library/${highlight.bookId}`);
  };

  return (
    <Card
      className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 relative cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {showBookTitle && (
            <div className="text-xs font-medium text-gray-500">
              {highlight.bookTitle}
            </div>
          )}
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => onTextChange(e.target.value)}
              className="w-full min-h-[100px] p-2 text-sm text-gray-900 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Edit your highlight..."
              autoFocus
            />
          ) : (
            <p className="text-sm text-gray-900">{highlight.text}</p>
          )}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span>Page {highlight.page}</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(highlight.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onSave}
                    className="text-green-500 hover:text-green-600 h-7 w-7"
                    disabled={isUpdating}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-500 h-7 w-7"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleFavorite}
                    className={`h-7 w-7 ${
                      highlight.isFavorite ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    <Heart
                      className="h-4 w-4"
                      fill={highlight.isFavorite ? "currentColor" : "none"}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onEdit}
                    className="text-gray-400 hover:text-blue-500 h-7 w-7"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onShowDeleteConfirm(true)}
                    className="text-gray-400 hover:text-red-500 h-7 w-7"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {showDeleteConfirm && (
          <DeleteConfirm
            title="Delete this highlight?"
            onConfirm={onDelete}
            onCancel={() => onShowDeleteConfirm(false)}
            isLoading={isDeleting}
          />
        )}
      </CardContent>
    </Card>
  );
}
