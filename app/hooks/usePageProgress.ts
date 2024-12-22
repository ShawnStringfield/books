import { useState, useEffect, ChangeEvent } from 'react';

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

export const usePageProgress = ({ initialPage, totalPages, onPageChange }: UsePageProgressProps): UsePageProgressReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputValue, setInputValue] = useState(initialPage.toString());

  useEffect(() => {
    setCurrentPage(initialPage);
    setInputValue(initialPage.toString());
  }, [initialPage]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= totalPages) {
      setCurrentPage(numValue);
      onPageChange([numValue]);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 0) {
      setInputValue('0');
      setCurrentPage(0);
      onPageChange([0]);
    } else if (numValue > totalPages) {
      setInputValue(totalPages.toString());
      setCurrentPage(totalPages);
      onPageChange([totalPages]);
    } else {
      setInputValue(numValue.toString());
      setCurrentPage(numValue);
      onPageChange([numValue]);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newPage = value[0];
    setCurrentPage(newPage);
    setInputValue(newPage.toString());
    onPageChange(value);
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
