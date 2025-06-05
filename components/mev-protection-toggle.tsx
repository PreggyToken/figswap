"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Shield, Info, Check, AlertTriangle, Loader2 } from "lucide-react"
import { verifyMEVProtection } from "@/lib/mev-middleware"

interface MEVProtectionToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function MEVProtectionToggle({ enabled, onToggle }: MEVProtectionToggleProps) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [endpoint, setEndpoint] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    async function checkMEVProtection() {
      setIsChecking(true)
      setError(null)

      try {
        const result = await verifyMEVProtection()
        setIsAvailable(result.available)
        setEndpoint(result.endpoint || null)

        if (!result.available) {
          setError(result.error || "MEV Protection not available")
        }
      } catch (err) {
        console.error("❌ Failed to check MEV protection:", err)
        setError("Failed to verify MEV protection status")
        setIsAvailable(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkMEVProtection()
  }, [])

  return (
    <div className="flex items-center justify-between glass-card-light p-4 rounded-xl border-slate-600/30 dark:border-slate-600/30 light:border-slate-200">
      <div className="flex items-center space-x-3">
        <Shield className={`h-6 w-6 ${enabled && isAvailable ? "text-emerald-500" : "text-slate-400"}`} />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="mev-protection"
              className="text-sm font-semibold text-white dark:text-white light:text-slate-800"
            >
              Blink MEV Protection
            </Label>

            <Dialog open={showInfo} onOpenChange={setShowInfo}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-5 w-5 text-slate-400 hover:text-white dark:hover:text-white light:hover:text-slate-900 p-0 rounded-full hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-slate-200 border border-slate-600 dark:border-slate-600 light:border-slate-300 hover:border-slate-500 dark:hover:border-slate-500 light:hover:border-slate-400"
                >
                  <Info className="h-3 w-3" />
                  <span className="sr-only">MEV Protection Info</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-slate-700/50 dark:border-slate-700/50 light:border-slate-300 text-white dark:text-white light:text-slate-800 shadow-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-emerald-500" />
                    <span>What is MEV Protection?</span>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  <div className="space-y-3 text-sm text-slate-300 dark:text-slate-300 light:text-slate-600">
                    <p>
                      <strong className="text-white dark:text-white light:text-slate-800">
                        MEV (Maximal Extractable Value)
                      </strong>{" "}
                      refers to profits that can be extracted from users by manipulating transaction order in the
                      mempool.
                    </p>

                    <p>
                      <strong className="text-white dark:text-white light:text-slate-800">Blink MEV Protection</strong>{" "}
                      shields your transactions from:
                    </p>

                    <div className="space-y-2 bg-slate-800/50 dark:bg-slate-800/50 light:bg-slate-100 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-emerald-500 dark:text-emerald-400 light:text-emerald-600">
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <span>
                          <strong>Front-running:</strong> Bots copying your trade ahead of you
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-emerald-500 dark:text-emerald-400 light:text-emerald-600">
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <span>
                          <strong>Sandwich attacks:</strong> Manipulating prices around your trade
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-emerald-500 dark:text-emerald-400 light:text-emerald-600">
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <span>
                          <strong>Back-running:</strong> Extracting value after your transaction
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-900/30 dark:bg-blue-900/30 light:bg-blue-50 border border-blue-700/50 dark:border-blue-700/50 light:border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-blue-200 dark:text-blue-200 light:text-blue-700">
                        <strong>How it works:</strong> Your transactions are sent through QuickNode's private relay
                        instead of the public mempool, making them invisible to MEV bots until confirmed.
                      </p>
                    </div>

                    {endpoint && (
                      <div className="bg-emerald-900/30 dark:bg-emerald-900/30 light:bg-emerald-50 border border-emerald-700/50 dark:border-emerald-700/50 light:border-emerald-200 rounded-lg p-3 mt-3">
                        <p className="text-emerald-200 dark:text-emerald-200 light:text-emerald-700">
                          <strong>Active Endpoint:</strong> {endpoint}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
            {isChecking
              ? "Checking availability..."
              : isAvailable
                ? `Ready on ${endpoint || "QuickNode"}`
                : error || "Not available"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {isChecking && <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />}

        {!isChecking && !isAvailable && (
          <div className="flex items-center text-orange-500 text-xs">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>Unavailable</span>
          </div>
        )}

        {!isChecking && isAvailable && (
          <div className="flex items-center text-emerald-500 text-xs">
            <Check className="h-3 w-3 mr-1" />
            <span>Available</span>
          </div>
        )}

        <Switch
          id="mev-protection"
          checked={enabled && isAvailable === true}
          onCheckedChange={(checked) => {
            if (isAvailable) {
              onToggle(checked)
            }
          }}
          disabled={isChecking || isAvailable === false}
          className="data-[state=checked]:bg-emerald-500"
        />
      </div>
    </div>
  )
}
