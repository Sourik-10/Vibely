import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("vibely-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("vibely-theme", theme);
    set({ theme })
  }

}));