"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface ThemeContextValue {
  isLightMode: boolean;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);


// helper hook
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}