"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, DollarSign, BarChart3, Users } from "lucide-react"

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

interface LiquidityData {
  tvl: number
  volume24h: number
  pairs: number
}

interface LiquidityInfoProps {
  fromToken: Token
  toToken: Token
  liquidityData: Record<string, LiquidityData>
  loading: boolean
}

export function LiquidityInfo({ fromToken, toToken, liquidityData, loading }: LiquidityInfoProps) {
  const fromData = liquidityData[fromToken.address]
  const toData = liquidityData[toToken.address]

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  return (
    <Card className="glass-card hover-lift">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white dark:text-white light:text-slate-800 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <span>Liquidity Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Token Liquidity */}
          <div className="glass-card-light rounded-lg p-4 border-slate-600/30 dark:border-slate-600/30 light:border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              {fromToken.logoURI && (
                <img
                  src={fromToken.logoURI || "/placeholder.svg"}
                  alt={fromToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <h3 className="font-semibold text-white dark:text-white light:text-slate-800">{fromToken.symbol}</h3>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-slate-700 dark:bg-slate-700 light:bg-slate-300" />
                <Skeleton className="h-4 w-16 bg-slate-700 dark:bg-slate-700 light:bg-slate-300" />
                <Skeleton className="h-4 w-12 bg-slate-700 dark:bg-slate-700 light:bg-slate-300" />
              </div>
            ) : fromData ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>TVL</span>
                  </span>
                  <span className="text-white dark:text-white light:text-slate-800 font-semibold">
                    {formatNumber(fromData.tvl)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>24h Volume</span>
                  </span>
                  <span className="text-white dark:text-white light:text-slate-800 font-semibold">
                    {formatNumber(fromData.volume24h)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>Pairs</span>
                  </span>
                  <span className="text-white dark:text-white light:text-slate-800 font-semibold">
                    {fromData.pairs}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 dark:text-slate-400 light:text-slate-500 text-sm">
                No liquidity data available
              </div>
            )}
          </div>

          {/* To Token Liquidity */}
          <div className="glass-card-light rounded-lg p-4 border-slate-600/30 dark:border-slate-600/30 light:border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              {toToken.logoURI && (
                <img
                  src={toToken.logoURI || "/placeholder.svg"}
                  alt={toToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <h3 className="font-semibold text-white dark:text-white light:text-slate-800">{toToken.symbol}</h3>
            </div>

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-slate-700 dark:bg-slate-700 light:bg-slate-300" />
                <Skeleton className="h-4 w-16 bg-slate-700 dark:bg-slate-700 light:bg-slate-300" />
                <Skeleton className="h-4 w-12 bg-slate-700 dark:bg-slate-700 light:bg-slate-300" />
              </div>
            ) : toData ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>TVL</span>
                  </span>
                  <span className="text-white dark:text-white light:text-slate-800 font-semibold">
                    {formatNumber(toData.tvl)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>24h Volume</span>
                  </span>
                  <span className="text-white dark:text-white light:text-slate-800 font-semibold">
                    {formatNumber(toData.volume24h)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 dark:text-slate-400 light:text-slate-500 flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>Pairs</span>
                  </span>
                  <span className="text-white dark:text-white light:text-slate-800 font-semibold">{toData.pairs}</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 dark:text-slate-400 light:text-slate-500 text-sm">
                No liquidity data available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
