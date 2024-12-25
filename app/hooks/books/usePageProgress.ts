import { useState, useEffect, ChangeEvent } from "react";

interface UsePageProgressProps {
  bookId: string;
  initialPage: number;
  totalPages: number;
  onPageChange: (value: number[]) => void | Promise<void>;
}

interface UsePageProgressReturn {
  currentPage: number;
  inputValue: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: () => void;
  handleSliderChange: (value: number[]) => void;
  pagesRemaining: number;
  error: Error | null;
}

export const usePageProgress = ({
  bookId,
  initialPage,
  totalPages,
  onPageChange,
}: UsePageProgressProps): UsePageProgressReturn => {
  if (!bookId) {
    console.error("Book ID is required for usePageProgress");
    throw new Error("Book ID is required");
  }

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputValue, setInputValue] = useState(initialPage.toString());
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setCurrentPage(initialPage);
    setInputValue(initialPage.toString());
  }, [initialPage]);

  const updateProgress = async (newPage: number) => {
    try {
      setError(null);

      if (newPage >= 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
        setInputValue(newPage.toString());
        await onPageChange([newPage]);
      } else {
        const error = new Error("Invalid page number");
        console.error(error.message);
        setError(error);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to update progress");
      console.error("Failed to update progress:", error);
      setError(error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      void updateProgress(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 0) {
      void updateProgress(0);
    } else if (numValue > totalPages) {
      void updateProgress(totalPages);
    } else {
      void updateProgress(numValue);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const [newPage] = value;
    void updateProgress(newPage);
  };

  const pagesRemaining = totalPages - currentPage;

  return {
    currentPage,
    inputValue,
    handleInputChange,
    handleInputBlur,
    handleSliderChange,
    pagesRemaining,
    error,
  };
};
