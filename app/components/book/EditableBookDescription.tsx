import { useState } from "react";
import { cn } from "@/app/lib/utils";

interface EditableBookDescriptionProps {
  description: string;
  bookId: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export default function EditableBookDescription({
  description,
  isEditing,
  onChange,
}: EditableBookDescriptionProps) {
  const [value, setValue] = useState(description);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChange(newValue);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full min-h-[200px] p-2 border rounded-md"
          placeholder="Add a description..."
          aria-label="Book description"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {description ? (
        <div>
          <p className={cn("leading-normal", !isExpanded && "line-clamp-3")}>
            {description}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-sm mt-1 hover:underline"
            aria-expanded={isExpanded}
            aria-controls="description-text"
          >
            {isExpanded ? "Show less" : "View more"}
          </button>
        </div>
      ) : (
        <p className="text-gray-600">No description available</p>
      )}
    </div>
  );
}
