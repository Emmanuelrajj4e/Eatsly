"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Sync with the class already applied by the pre-paint script in layout.tsx.
  // (deferred to the next frame: avoids a synchronous setState in the effect)
  useEffect(() => {
    const id = window.requestAnimationFrame(() =>
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    );
    return () => window.cancelAnimationFrame(id);
  }, []);

  const toggle = () => {
    const next: Theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("eatsly-theme", next);
    } catch {
      /* private mode: theme won't persist */
    }
    setTheme(next);
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
