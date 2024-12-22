import { createContext, useContext, useState, ReactNode } from 'react';

interface EditModeContextType {
  showEditControls: boolean;
  toggleEditControls: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [showEditControls, setShowEditControls] = useState(false);

  const toggleEditControls = () => {
    setShowEditControls((prev) => !prev);
  };

  return <EditModeContext.Provider value={{ showEditControls, toggleEditControls }}>{children}</EditModeContext.Provider>;
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
}
