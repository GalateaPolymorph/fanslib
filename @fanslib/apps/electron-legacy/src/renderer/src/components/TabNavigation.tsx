import { ReactNode, useState } from "react";

type TabConfig<T extends string> = {
  id: T;
  label: string;
  content: ReactNode;
};

type UseTabNavigationProps<T extends string> = {
  tabs: TabConfig<T>[];
  storageKey: string;
  defaultTabId: T;
};

export const useTabNavigation = <T extends string>({
  tabs,
  storageKey,
  defaultTabId,
}: UseTabNavigationProps<T>) => {
  const [activeTabId, setActiveTabId] = useState<T>(() => {
    const savedTab = localStorage.getItem(storageKey);
    return (savedTab as T) || defaultTabId;
  });

  const updateActiveTab = (tabId: T) => {
    setActiveTabId(tabId);
    localStorage.setItem(storageKey, tabId);
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return {
    activeTabId,
    activeTab,
    updateActiveTab,
  };
};

type TabNavigationProps<T extends string> = {
  tabs: TabConfig<T>[];
  activeTabId: T;
  onTabChange: (tabId: T) => void;
  className?: string;
};

export const TabNavigation = <T extends string>({
  tabs,
  activeTabId,
  onTabChange,
  className = "",
}: TabNavigationProps<T>) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-2xl font-bold ${
            activeTabId === tab.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
