import { useEffect } from "react";
import { useSettingsStore } from "@/app/(features)/dashboard/settings/hooks/useSettingsStore";

interface SettingsProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const initializeStore = useSettingsStore((state) => state.initializeStore);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return <>{children}</>;
}
