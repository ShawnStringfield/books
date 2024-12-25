import { Settings2, Pencil, AlertCircle, X } from "lucide-react";
import { ReadingStatus } from "@/app/stores/types";
import ReadingStatusSelect from "./ReadingStatusSelect";
import BookProgressSlider from "./BookProgressSlider";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import WarningAlert from "@/app/components/ui/warning-alert";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateBook } from "@/app/hooks/books/useBooks";

interface ReadingControlsProps {
  bookId: string;
  currentPage: number;
  totalPages: number;
  status: (typeof ReadingStatus)[keyof typeof ReadingStatus];
  uniqueId: string;
  variant: "mobile" | "desktop" | "icon";
  size?: "default" | "sm";
  className?: string;
  onStatusChange: (
    bookId: string,
    status: (typeof ReadingStatus)[keyof typeof ReadingStatus]
  ) => void;
  onProgressChange: (value: number[]) => void;
  onCancel?: () => void;
  manualTotalPages?: string;
  onManualTotalPagesChange?: (value: string) => void;
  onTotalPagesUpdate?: (value: number) => void;
  onDelete?: () => void;
  isLastBook?: boolean;
  fromGoogle?: boolean;
  shouldWarnOnReset?: boolean;
}

const ReadingControls = ({
  bookId,
  currentPage,
  totalPages,
  status,
  uniqueId,
  variant,
  size = "default",
  className,
  onStatusChange,
  onProgressChange,
  onCancel,
  manualTotalPages = "",
  onManualTotalPagesChange,
  onTotalPagesUpdate,
  fromGoogle = false,
  shouldWarnOnReset = true,
}: ReadingControlsProps) => {
  const [showWarning, setShowWarning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const updateBookMutation = useUpdateBook();

  const canEditPages = !fromGoogle || totalPages === 0;

  const handleStatusChange = (
    bookId: string,
    newStatus: (typeof ReadingStatus)[keyof typeof ReadingStatus]
  ) => {
    if (
      shouldWarnOnReset &&
      newStatus === ReadingStatus.NOT_STARTED &&
      currentPage > 0
    ) {
      setShowWarning(true);
    } else {
      onStatusChange(bookId, newStatus);
    }
  };

  const handleTotalPagesUpdate = async (value: number) => {
    if (!isNaN(value) && value > 0) {
      try {
        // Update total pages first
        await updateBookMutation.mutateAsync({
          bookId,
          updates: { totalPages: value },
        });

        // Then update the reading progress if needed
        const newCurrentPage = Math.min(currentPage || 0, value);
        if (newCurrentPage !== currentPage) {
          onProgressChange([newCurrentPage]);
        }

        onManualTotalPagesChange?.("");
        onTotalPagesUpdate?.(value);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update book:", error);
      }
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    onManualTotalPagesChange?.(totalPages?.toString() || "");
  };

  const cancelEditing = () => {
    setIsEditing(false);
    onManualTotalPagesChange?.("");
  };

  const warningActions = [
    {
      label: "Cancel",
      onClick: () => setShowWarning(false),
      variant: "ghost" as const,
      className: "text-amber-500",
    },
    {
      label: "Confirm",
      onClick: () => {
        setShowWarning(false);
        onStatusChange(bookId, ReadingStatus.NOT_STARTED);
      },
      variant: "ghost" as const,
      className: "text-amber-800",
    },
  ];

  if (variant === "icon") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-10 w-10 rounded-full hover:bg-brand-muted")}
          aria-expanded="true"
          aria-controls={`reading-controls-${uniqueId}`}
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn("space-y-6", className)}
      id={`reading-controls-${uniqueId}`}
    >
      {/* Total Pages Section */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1">
          {isEditing && canEditPages ? (
            <div className="inline-flex items-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                className="w-16 h-6 text-base text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={manualTotalPages}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*$/.test(value)) {
                    onManualTotalPagesChange?.(value);
                  }
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const value = parseInt(e.target.value, 10);
                  if (!isNaN(value) && value > 0) {
                    handleTotalPagesUpdate(value);
                  }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    const value = parseInt(e.currentTarget.value, 10);
                    if (!isNaN(value) && value > 0) {
                      handleTotalPagesUpdate(value);
                    }
                    e.currentTarget.blur();
                  } else if (e.key === "Escape") {
                    cancelEditing();
                    e.currentTarget.blur();
                  }
                }}
                autoFocus
              />
              <button
                onClick={cancelEditing}
                className="inline-flex items-center text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                title="Cancel editing"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <span className="text-sm text-gray-600">{totalPages || 0}</span>
          )}
          <label className="text-sm font-medium">Total Pages</label>
          {canEditPages && !isEditing && (
            <button
              onClick={startEditing}
              className="inline-flex items-center text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
              title="Edit total pages"
            >
              <Pencil className="h-3 w-3" />
            </button>
          )}
        </div>
        {totalPages === 0 && (
          <span className="text-yellow-600 text-sm flex items-center gap-1 mt-2">
            <AlertCircle className="h-4 w-4" />
            Set page count to track progress
          </span>
        )}
      </div>

      {/* Reading Progress Section */}
      <BookProgressSlider
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(value) => {
          const newPage = value[0];
          onProgressChange(value);

          // Let parent component handle status changes based on progress
          if (newPage === 0 && status !== ReadingStatus.NOT_STARTED) {
            handleStatusChange(bookId, ReadingStatus.NOT_STARTED);
          } else if (
            newPage === totalPages &&
            status !== ReadingStatus.COMPLETED
          ) {
            handleStatusChange(bookId, ReadingStatus.COMPLETED);
          } else if (
            newPage > 0 &&
            newPage < totalPages &&
            (status === ReadingStatus.NOT_STARTED ||
              status === ReadingStatus.COMPLETED)
          ) {
            handleStatusChange(bookId, ReadingStatus.IN_PROGRESS);
          }
        }}
        variant={variant}
        uniqueId={uniqueId}
        showPercentage={true}
        className="py-4"
        aria-label={`Reading progress: ${currentPage} of ${totalPages} pages`}
      />

      {/* Bottom Section with Status and Actions */}
      <div className="flex items-center justify-between">
        {/* Reading Status Section */}
        <div>
          <ReadingStatusSelect
            status={status}
            onStatusChange={(newStatus) =>
              handleStatusChange(bookId, newStatus)
            }
            size={size}
            aria-label="Reading status"
          />
          <AnimatePresence mode="sync">
            {showWarning && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="overflow-hidden mt-2"
              >
                <WarningAlert
                  message="Changing to &ldquo;Not Started&rdquo; will reset your reading progress to 0 pages."
                  variant="warning"
                  actions={warningActions}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {onCancel && (
          <Button
            variant="secondary"
            size="sm"
            className="text-xs py-1 px-2"
            onClick={onCancel}
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReadingControls;
