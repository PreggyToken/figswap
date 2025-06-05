"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SlippageSettingsProps {
  slippage: number
  onSlippageChange: (slippage: number) => void
}

export function SlippageSettings({ slippage, onSlippageChange }: SlippageSettingsProps) {
  const presetSlippages = [0.1, 0.5, 1.0]

  return (
    <div className="glass-card-light rounded-xl p-4 space-y-4 border-slate-600/30 dark:border-slate-600/30 light:border-slate-200">
      <Label className="text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-600">
        Slippage Tolerance
      </Label>

      <div className="flex space-x-2">
        {presetSlippages.map((preset) => (
          <Button
            key={preset}
            variant={slippage === preset ? "default" : "outline"}
            size="sm"
            onClick={() => onSlippageChange(preset)}
            className={`flex-1 ${
              slippage === preset
                ? "accent-gradient text-white"
                : "bg-slate-800/50 dark:bg-slate-800/50 light:bg-white border-slate-600 dark:border-slate-600 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-600 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-slate-100"
            }`}
          >
            {preset}%
          </Button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Input
          type="number"
          step="0.1"
          min="0.1"
          max="50"
          value={slippage}
          onChange={(e) => onSlippageChange(Number.parseFloat(e.target.value) || 0.5)}
          className="flex-1 bg-slate-800/50 dark:bg-slate-800/50 light:bg-white border-slate-600 dark:border-slate-600 light:border-slate-300 text-white dark:text-white light:text-slate-800 focus:border-emerald-500"
        />
        <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-500">%</span>
      </div>

      {slippage > 5 && (
        <div className="text-orange-500 dark:text-orange-400 light:text-orange-600 text-xs">
          ⚠️ High slippage tolerance may result in unfavorable trades
        </div>
      )}
    </div>
  )
}
