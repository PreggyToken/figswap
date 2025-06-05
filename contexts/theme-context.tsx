"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("figswap-theme") as Theme | null
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme(systemPrefersDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.remove("light-theme", "dark-theme")
    document.documentElement.classList.add(`${theme}-theme`)
    localStorage.setItem("figswap-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
