import { ReactNode, useState } from "react";
import { ThemeContext } from "./ThemeContext";


export function ThemeProvider({ children }: { children: ReactNode}) {
  const [isLightMode, setIsLightMode] = useState(true);

  const toggle = () => setIsLightMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isLightMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}