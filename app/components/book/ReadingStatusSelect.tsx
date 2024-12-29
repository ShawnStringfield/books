import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/app/components/ui/select";
import { readingStatusOptions } from "@/app/config/readingStatusConfig";
import { ReadingStatusType } from "@/app/stores/types";

interface ReadingStatusSelectProps {
  status: ReadingStatusType;
  onStatusChange: (status: ReadingStatusType) => void;
  className?: string;
  size?: "default" | "sm";
}

const ReadingStatusSelect = ({
  status,
  onStatusChange,
  className = "",
  size = "default",
}: ReadingStatusSelectProps) => {
  const currentOption = readingStatusOptions.find(
    (option) => option.value === status,
  );

  return (
    <Select
      defaultValue={status}
      onValueChange={(value) => onStatusChange(value as ReadingStatusType)}
    >
      <SelectTrigger
        className={`${
          size === "sm" ? "h-7 text-xs" : "h-9 text-sm"
        } w-[140px] ${className} pl-3 pr-2 border border-mono-subtle bg-mono-surface hover:bg-mono-subtle/50 transition-colors`}
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="truncate">{currentOption?.label}</span>
        </div>
      </SelectTrigger>
      <SelectContent align="start" className="min-w-[200px]">
        {readingStatusOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={`${size === "sm" ? "text-xs" : "text-sm"} pl-3 pr-2`}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-4 flex justify-center shrink-0">
                {option.icon}
              </span>
              <span className="truncate">{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ReadingStatusSelect;
