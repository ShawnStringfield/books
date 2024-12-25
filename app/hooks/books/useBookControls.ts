import { useState } from "react";

interface UseBookControlsProps {
  initialManualTotalPages?: string;
}

interface UseBookControlsReturn {
  showReadingControls: boolean;
  showHighlightForm: boolean;
  manualTotalPages: string;
  showDeleteWarning: boolean;
  toggleReadingControls: () => void;
  toggleHighlightForm: () => void;
  setManualTotalPages: (value: string) => void;
  setShowDeleteWarning: (show: boolean) => void;
  resetControls: () => void;
}

export function useBookControls({
  initialManualTotalPages = "",
}: UseBookControlsProps = {}): UseBookControlsReturn {
  const [showReadingControls, setShowReadingControls] = useState(false);
  const [showHighlightForm, setShowHighlightForm] = useState(false);
  const [manualTotalPages, setManualTotalPages] = useState(
    initialManualTotalPages
  );
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const toggleReadingControls = () => setShowReadingControls((prev) => !prev);
  const toggleHighlightForm = () => setShowHighlightForm((prev) => !prev);

  const resetControls = () => {
    setShowReadingControls(false);
    setShowHighlightForm(false);
    setManualTotalPages("");
    setShowDeleteWarning(false);
  };

  return {
    showReadingControls,
    showHighlightForm,
    manualTotalPages,
    showDeleteWarning,
    toggleReadingControls,
    toggleHighlightForm,
    setManualTotalPages,
    setShowDeleteWarning,
    resetControls,
  };
}
