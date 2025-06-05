"use client"

import { useState, useEffect } from "react"

interface LiquidityData {
  tvl: number
  volume24h: number
  pairs: number
}

export function useLiquidityData(tokenAddresses: string[]) {
  const [liquidityData, setLiquidityData] = useState<Record<string, LiquidityData>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tokenAddresses.length === 0) return

    const fetchLiquidityData = async () => {
      setLoading(true)
      try {
        // Simulate API call to Coinpaprika/QuickNode Token Price & Liquidity API
        // In a real implementation, you would call the actual API
        const mockData: Record<string, LiquidityData> = {}

        for (const address of tokenAddresses) {
          // Generate realistic mock data based on token
          const baseValue =
            address === "So11111111111111111111111111111111111111112"
              ? 500000000
              : address === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                ? 300000000
                : Math.random() * 100000000 + 10000000

          mockData[address] = {
            tvl: baseValue,
            volume24h: baseValue * 0.1,
            pairs: Math.floor(Math.random() * 50) + 10,
          }
        }

        setLiquidityData(mockData)
      } catch (error) {
        console.error("Failed to fetch liquidity data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLiquidityData()

    // Refresh data every 60 seconds
    const interval = setInterval(fetchLiquidityData, 60000)
    return () => clearInterval(interval)
  }, [tokenAddresses.join(",")])

  return { liquidityData, loading }
}
