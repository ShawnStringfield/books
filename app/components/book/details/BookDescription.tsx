import { type Book } from "@/app/stores/types";
import EditableBookDescription from "../EditableBookDescription";

interface BookDescriptionProps {
  book: Required<Book>;
  showEditControls: boolean;
  onDescriptionChange: (description: string) => void;
}

export function BookDescription({
  book,
  showEditControls,
  onDescriptionChange,
}: BookDescriptionProps) {
  return (
    <div className="space-y-4 pt-8">
      <h2 className="text-lg font-semibold leading-tight">About This Book</h2>
      <EditableBookDescription
        description={book.description || ""}
        bookId={book.id}
        isEditing={showEditControls}
        onChange={onDescriptionChange}
      />
    </div>
  );
}
