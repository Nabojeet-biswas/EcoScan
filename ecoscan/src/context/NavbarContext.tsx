import { createContext, useContext, useState, type ReactNode } from "react";

interface NavbarConfig {
  onScanClick: () => void;
  onHomeClick?: () => void;
  ecoPoints?: number;
  showPoints?: boolean;
  onHistoryClick?: () => void;
  isScannerPage?: boolean;
}

interface NavbarContextValue {
  config: NavbarConfig | null;
  setConfig: (config: NavbarConfig) => void;
}

const NavbarContext = createContext<NavbarContextValue | null>(null);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<NavbarConfig | null>(null);

  return (
    <NavbarContext.Provider value={{ config, setConfig }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarConfig() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbarConfig must be used within a NavbarProvider");
  }
  return context;
}