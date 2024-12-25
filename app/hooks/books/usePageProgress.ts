import { useState, useEffect, ChangeEvent } from "react";

interface UsePageProgressProps {
  initialPage: number;
  totalPages: number;
  onPageChange: (value: number[]) => void;
}

interface UsePageProgressReturn {
  currentPage: number;
  inputValue: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: () => void;
  handleSliderChange: (value: number[]) => void;
  pagesRemaining: number;
}

export const usePageProgress = ({
  initialPage,
  totalPages,
  onPageChange,
}: UsePageProgressProps): UsePageProgressReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputValue, setInputValue] = useState(initialPage.toString());

  useEffect(() => {
    setCurrentPage(initialPage);
    setInputValue(initialPage.toString());
  }, [initialPage]);

  const updateProgress = (newPage: number) => {
    if (newPage >= 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setInputValue(newPage.toString());
      onPageChange([newPage]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      updateProgress(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 0) {
      updateProgress(0);
    } else if (numValue > totalPages) {
      updateProgress(totalPages);
    } else {
      updateProgress(numValue);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newPage = value[0];
    updateProgress(newPage);
  };

  const pagesRemaining = totalPages - currentPage;

  return {
    currentPage,
    inputValue,
    handleInputChange,
    handleInputBlur,
    handleSliderChange,
    pagesRemaining,
  };
};
