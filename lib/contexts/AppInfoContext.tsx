"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAppInfo } from "@/lib/queries/useAppInfo";
import type { AppInfoContextValue } from "@/types";

const AppInfoContext = createContext<AppInfoContextValue | null>(null);

export function AppInfoProvider({ children }: { children: ReactNode }) {
  // The query only fires once — React Query deduplicates any other
  // callers of useAppInfo elsewhere in the tree.
  const value = useAppInfo();

  return (
    <AppInfoContext.Provider value={value}>{children}</AppInfoContext.Provider>
  );
}

export function useAppInfoContext(): AppInfoContextValue {
  const ctx = useContext(AppInfoContext);
  if (!ctx)
    throw new Error("useAppInfoContext must be used within <AppInfoProvider>");
  return ctx;
}
