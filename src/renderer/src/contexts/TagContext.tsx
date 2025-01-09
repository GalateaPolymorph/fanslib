import { createContext, useContext, useEffect, useState } from "react";
import { Tag } from "../../../features/tags/entity";

type TagContextType = {
  tags: Tag[];
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const TagContext = createContext<TagContextType | null>(null);

export const TagProvider = ({ children }: { children: React.ReactNode }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTags = async () => {
    try {
      const allTags = await window.api["tag:getAll"]();
      setTags(allTags);
    } catch (error) {
      console.error("Failed to load tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTags();
  }, []);

  return (
    <TagContext.Provider
      value={{
        tags,
        isLoading,
        refresh: loadTags,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export const useTags = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTags must be used within a TagProvider");
  }
  return context;
};
