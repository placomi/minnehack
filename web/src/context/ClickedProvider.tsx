"use client";

import { ReactNode, useState } from "react";
import { ClickedContext } from "./ClickedContext";
import { Snippet, type SnippetT } from "@/types/Snippet";


export function ClickedProvider({ children }: { children: ReactNode}) {
  const [snippets, setSnippets] = useState<SnippetT[]>([]);

  return (
    <ClickedContext.Provider value={{ snippets, setSnippets }}>
      {children}
    </ClickedContext.Provider>
  );
}