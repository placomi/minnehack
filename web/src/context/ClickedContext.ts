"use client";

import { useContext, createContext } from "react";
import { type SnippetT } from '@/types/Snippet'

export interface ClickedContextValue {
  snippets: SnippetT[];
  setSnippets: React.Dispatch<React.SetStateAction<SnippetT[]>>;
}

export const ClickedContext = createContext<ClickedContextValue | undefined>(undefined);

export function useClickedSnippets() {
  const ctx = useContext(ClickedContext);
  if (!ctx) throw new Error("useClickedSnippets must be inside ClickedProvider");
  return ctx;
}