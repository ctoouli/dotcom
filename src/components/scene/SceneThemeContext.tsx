"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "dotcom-theme";

type ThemeContextValue = {
  isDark: boolean;
  setDark: (dark: boolean) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
  } catch (_) {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDarkState] = useState(() =>
    typeof window !== "undefined" ? getInitialDark() : false
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    } catch (_) {}
  }, [mounted, isDark]);

  const setDark = useCallback((dark: boolean) => setIsDarkState(dark), []);
  const toggleTheme = useCallback(() => setIsDarkState((prev) => !prev), []);

  const value: ThemeContextValue = { isDark, setDark, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Returns dark mode state and controls. Must be used within ThemeProvider.
 * Falls back to system preference when outside provider (e.g. initial render).
 */
export function useDarkMode(): boolean {
  const ctx = useContext(ThemeContext);
  const [systemDark, setSystemDark] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(m.matches);
    const fn = () => setSystemDark(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  return ctx?.isDark ?? systemDark;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  const [systemDark, setSystemDark] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(m.matches);
    const fn = () => setSystemDark(m.matches);
    m.addEventListener("change", fn);
    return () => m.removeEventListener("change", fn);
  }, []);
  if (ctx) return ctx;
  return {
    isDark: systemDark,
    setDark: () => {},
    toggleTheme: () => {},
  };
}

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 10,
        padding: "10px 14px",
        background: "var(--background)",
        border: "1px solid var(--foreground)",
        borderRadius: 6,
        fontFamily: "inherit",
        fontSize: 14,
        color: "var(--foreground)",
        cursor: "pointer",
      }}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
