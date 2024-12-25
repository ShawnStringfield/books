import { X } from "lucide-react";
import { SheetClose, SheetHeader } from "@/app/components/ui/sheet";
import BookToolbar from "../BookToolbar";

interface BookDetailsSheetHeaderProps {
  onReadingControlsClick: () => void;
  onHighlightClick: () => void;
  onDeleteClick: () => void;
  showReadingControls: boolean;
  showHighlights: boolean;
}

export function BookDetailsSheetHeader({
  onReadingControlsClick,
  onHighlightClick,
  onDeleteClick,
  showReadingControls,
  showHighlights,
}: BookDetailsSheetHeaderProps) {
  return (
    <SheetHeader className="px-4 sm:px-6 pt-4">
      <div className="flex justify-between items-center mb-4">
        <BookToolbar
          onReadingControlsClick={onReadingControlsClick}
          onHighlightClick={onHighlightClick}
          onDeleteClick={onDeleteClick}
          showReadingControls={showReadingControls}
          showHighlights={showHighlights}
          className="mt-8"
          variant="sheet"
        />
        <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </div>
    </SheetHeader>
  );
}
