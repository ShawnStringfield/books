import { ExternalLink, Info } from "lucide-react";
import { type Book } from "@/app/stores/types";
import { Button } from "@/app/components/ui/button";

interface BookHeaderProps {
  book: Required<Book>;
  showEditControls: boolean;
  onCancelEdit: () => void;
  onSaveChanges: () => void;
}

export function BookHeader({
  book,
  showEditControls,
  onCancelEdit,
  onSaveChanges,
}: BookHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-0">{book.title}</h1>
        {book.subtitle && (
          <h2 className="text-mono text-lg font-semibold leading-tight">
            {book.subtitle}
          </h2>
        )}
      </div>

      {showEditControls && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelEdit}
            className="text-xs py-1 px-2"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSaveChanges}
            className="text-xs py-1 px-2 bg-brand"
          >
            Save Changes
          </Button>
        </div>
      )}

      <div className="mt-2">
        <div className="my-4">
          <p className="text-sm text-mono">
            By: {book.author} • {book.totalPages || 0} pages
          </p>
        </div>
        <div className="flex items-center gap-4 mt-3">
          {book.previewLink && (
            <a
              href={book.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-brand hover:text-blue-800 transition-colors"
              aria-label="Preview book"
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </a>
          )}
          {book.infoLink && (
            <a
              href={book.infoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-brand hover:text-blue-800 transition-colors"
              aria-label="More information about book"
            >
              <Info className="h-4 w-4" />
              More Information
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
