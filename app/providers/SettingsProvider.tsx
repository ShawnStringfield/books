import { useEffect } from "react";
import {
  useSettingsStore,
  type SettingsStore,
} from "@/app/(features)/settings/hooks/useSettingsStore";

interface SettingsProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const initializeStore = useSettingsStore(
    (state: SettingsStore) => state.initializeStore,
  );

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return <>{children}</>;
}
