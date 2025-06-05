"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-8 h-8 sm:w-9 sm:h-9 transition-colors dark-theme:bg-slate-800/50 dark-theme:border-slate-700 dark-theme:text-slate-400 dark-theme:hover:text-white dark-theme:hover:bg-slate-700 light-theme:bg-slate-100 light-theme:border-slate-300 light-theme:text-slate-600 light-theme:hover:text-slate-900 light-theme:hover:bg-slate-200 border"
    >
      {theme === "dark" ? (
        <Sun className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
      ) : (
        <Moon className="h-[1rem] w-[1rem] sm:h-[1.2rem] sm:w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
