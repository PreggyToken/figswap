"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingDown, DollarSign, Users, BarChart3 } from "lucide-react"

export function MarketOverview() {
  const marketData = [
    {
      label: "24h Volume",
      value: "$2.4B",
      change: "+12.5%",
      positive: true,
      icon: BarChart3,
      color: "text-emerald-500 dark:text-emerald-400 light:text-emerald-600",
    },
    {
      label: "Total Liquidity",
      value: "$890M",
      change: "+5.2%",
      positive: true,
      icon: DollarSign,
      color: "text-blue-500 dark:text-blue-400 light:text-blue-600",
    },
    {
      label: "Active Traders",
      value: "45.2K",
      change: "+8.1%",
      positive: true,
      icon: Users,
      color: "text-purple-500 dark:text-purple-400 light:text-purple-600",
    },
    {
      label: "Avg. Slippage",
      value: "0.12%",
      change: "-0.03%",
      positive: true,
      icon: TrendingDown,
      color: "text-orange-500 dark:text-orange-400 light:text-orange-600",
    },
  ]

  return (
    <Card className="glass-card hover-lift">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {marketData.map((item, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-500 font-medium">
                  {item.label}
                </span>
              </div>
              <div className="text-2xl font-bold text-white dark:text-white light:text-slate-800">{item.value}</div>
              <div
                className={`text-sm font-medium ${
                  item.positive
                    ? "text-emerald-400 dark:text-emerald-400 light:text-emerald-600"
                    : "text-red-400 dark:text-red-400 light:text-red-600"
                }`}
              >
                {item.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
