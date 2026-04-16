import { create } from "zustand";

interface ThemeStore {
  dark: boolean;
  toggle: () => void;
  load: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  dark: false,
  toggle: () => {
    const next = !get().dark;
    set({ dark: next });
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
    }
  },
  load: () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved ? saved === "dark" : prefersDark;
    set({ dark });
    document.documentElement.classList.toggle("dark", dark);
  },
}));
