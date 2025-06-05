"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Activity, Zap, Shield } from "lucide-react"
import { MEVStats } from "@/components/mev-stats"

export function StatsPanel() {
  return (
    <div className="space-y-6">
      {/* MEV Protection Stats */}
      <MEVStats />

      {/* Market Stats */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white dark:text-white light:text-slate-800 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span>Market Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">24h Volume</span>
            <span className="text-white dark:text-white light:text-slate-800 font-bold">$2.4B</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">Total Liquidity</span>
            <span className="text-white dark:text-white light:text-slate-800 font-bold">$890M</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">Active Pairs</span>
            <span className="text-white dark:text-white light:text-slate-800 font-bold">1,247</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">Avg. Slippage</span>
            <span className="text-emerald-500">0.12%</span>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white dark:text-white light:text-slate-800 flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <span>Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-emerald-500 dark:text-emerald-400 light:text-emerald-600 border-emerald-500 dark:border-emerald-400 light:border-emerald-600"
            >
              <Shield className="w-3 h-3 mr-1" />
              MEV Protection
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-emerald-500 dark:text-emerald-400 light:text-emerald-600 border-emerald-500 dark:border-emerald-400 light:border-emerald-600"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Best Rates
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-blue-500 dark:text-blue-400 light:text-blue-600 border-blue-500 dark:border-blue-400 light:border-blue-600"
            >
              <Zap className="w-3 h-3 mr-1" />
              Instant Swaps
            </Badge>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-4">
            Protected by QuickNode Blink MEV Protection and powered by Jupiter aggregator.
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass-card hover-lift">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white dark:text-white light:text-slate-800">
            Recent Swaps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">SOL → USDC</span>
            <span className="text-emerald-500 dark:text-emerald-400 light:text-emerald-600">+$1,234</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">BONK → SOL</span>
            <span className="text-emerald-500 dark:text-emerald-400 light:text-emerald-600">+$567</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 dark:text-slate-400 light:text-slate-500">JUP → USDT</span>
            <span className="text-emerald-500 dark:text-emerald-400 light:text-emerald-600">+$890</span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 text-center mt-4">
            Live transaction feed
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
