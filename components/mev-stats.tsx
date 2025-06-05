"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, TrendingUp, AlertCircle } from "lucide-react"
import { getMEVProtectionStats } from "@/lib/mev-middleware"

export function MEVStats() {
  const [stats, setStats] = useState({
    transactionsProtected: 0,
    valueProtected: 0,
    isActive: false,
    endpoint: undefined as string | undefined,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getMEVProtectionStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch MEV stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="glass-card hover-lift">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-white dark:text-white light:text-slate-800 flex items-center space-x-2">
          <Shield className={`h-5 w-5 ${stats.isActive ? "text-emerald-500" : "text-slate-400"}`} />
          <span>MEV Protection</span>
          {!stats.isActive && <AlertCircle className="h-4 w-4 text-orange-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.isActive ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card-light p-3 border-slate-600/30 dark:border-slate-600/30 light:border-slate-200 rounded-lg">
                <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-500">
                  Transactions Protected
                </div>
                <div className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-800">
                  {loading ? "..." : stats.transactionsProtected.toLocaleString()}
                </div>
              </div>
              <div className="glass-card-light p-3 border-slate-600/30 dark:border-slate-600/30 light:border-slate-200 rounded-lg">
                <div className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-500">Value Protected</div>
                <div className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-800">
                  {loading ? "..." : `$${stats.valueProtected.toLocaleString()}`}
                </div>
              </div>
            </div>
            <div className="text-xs text-center text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Protected by QuickNode Blink</span>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 dark:text-slate-300 light:text-slate-600">
              MEV Protection Unavailable
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-1">
              {loading ? "Checking..." : "Verify QuickNode endpoint and Blink add-on"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
