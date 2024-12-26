import { CalendarDays } from "lucide-react";
import { Book, ReadingStatus } from "@/app/stores/types";
import { formatRelativeDate } from "@/app/lib/utils/dateUtils";
import { cn } from "@/app/lib/utils";

interface ReadingDatesProps {
  book: Book;
  className?: string;
}

const ReadingDates = ({ book, className }: ReadingDatesProps) => {
  const showStartDate =
    book.status === ReadingStatus.IN_PROGRESS ||
    book.status === ReadingStatus.COMPLETED;

  return (
    <div className={cn("flex flex-col gap-1 text-sm text-mono", className)}>
      {showStartDate && book.startDate ? (
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-mono" />
          <span>Started {formatRelativeDate(book.startDate).formatted}</span>
        </div>
      ) : null}
      {book.status === ReadingStatus.COMPLETED && book.completedDate ? (
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 " />
          <span>
            Completed {formatRelativeDate(book.completedDate).formatted}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default ReadingDates;
