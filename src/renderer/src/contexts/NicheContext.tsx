import { createContext, useContext, useEffect, useState } from "react";
import { Niche } from "../../../features/niches/entity";

type NicheContextType = {
  niches: Niche[];
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const NicheContext = createContext<NicheContextType | null>(null);

export const NicheProvider = ({ children }: { children: React.ReactNode }) => {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNiches = async () => {
    try {
      const allNiches = await window.api["niche:getAll"]();
      setNiches(allNiches);
    } catch (error) {
      console.error("Failed to load niches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadNiches();
  }, []);

  return (
    <NicheContext.Provider
      value={{
        niches,
        isLoading,
        refresh: loadNiches,
      }}
    >
      {children}
    </NicheContext.Provider>
  );
};

export const useNiches = () => {
  const context = useContext(NicheContext);
  if (!context) {
    throw new Error("useNiches must be used within a NicheProvider");
  }
  return context;
};
