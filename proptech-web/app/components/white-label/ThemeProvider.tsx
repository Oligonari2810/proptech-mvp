"use client";
import { createContext, useContext, useMemo } from "react";

type ThemeConfig = {
  colors: { primary: string; secondary: string; accent: string; background: string };
  logoUrl?: string;
  fontFamily?: string;
};

const DefaultTheme: ThemeConfig = {
  colors: { primary: "#1E293B", secondary: "#E5B769", accent: "#0EA5E9", background: "#F8FAFC" },
  logoUrl: "/images/Logo.png",
  fontFamily: "Inter, system-ui, sans-serif",
};

const ThemeCtx = createContext<ThemeConfig>(DefaultTheme);
export function useThemeConfig() { return useContext(ThemeCtx); }

export default function ThemeProvider({ children, theme }: { children: React.ReactNode; theme?: Partial<ThemeConfig> }) {
  const merged = useMemo<ThemeConfig>(() => ({
    ...DefaultTheme,
    ...(theme || {}),
    colors: { ...DefaultTheme.colors, ...(theme?.colors || {}) },
  }), [theme]);
  return <ThemeCtx.Provider value={merged}>{children}</ThemeCtx.Provider>;
}


