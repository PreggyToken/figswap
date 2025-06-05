"use client"

import { useState, useEffect } from "react"

export function useTokenPrices(tokenAddresses: string[]) {
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (tokenAddresses.length === 0) return

    const fetchPrices = async () => {
      setLoading(true)
      setError(null)

      try {
        // Try multiple price sources for better reliability
        const priceData: Record<string, number> = {}

        // Method 1: Try Jupiter Price API v6
        try {
          const jupiterResponse = await fetch(`https://api.jup.ag/price/v2?ids=${tokenAddresses.join(",")}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          })

          if (jupiterResponse.ok) {
            const jupiterData = await jupiterResponse.json()
            if (jupiterData.data) {
              Object.entries(jupiterData.data).forEach(([address, priceInfo]: [string, any]) => {
                if (priceInfo && typeof priceInfo.price === "number") {
                  priceData[address] = priceInfo.price
                }
              })
            }
          }
        } catch (jupiterError) {
          console.warn("Jupiter API failed:", jupiterError)
        }

        // Method 2: Try CoinGecko for missing prices
        if (Object.keys(priceData).length === 0) {
          try {
            // Map common token addresses to CoinGecko IDs
            const tokenIdMap: Record<string, string> = {
              So11111111111111111111111111111111111111112: "solana",
              EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "usd-coin",
              Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: "tether",
              "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": "lido-staked-sol",
              mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So: "marinade-staked-sol",
              JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: "jupiter-exchange-solana",
              DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263: "bonk",
              HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3: "pyth-network",
            }

            const coinGeckoIds = tokenAddresses.map((addr) => tokenIdMap[addr]).filter(Boolean)

            if (coinGeckoIds.length > 0) {
              const cgResponse = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIds.join(",")}&vs_currencies=usd`,
                {
                  method: "GET",
                  headers: {
                    Accept: "application/json",
                  },
                },
              )

              if (cgResponse.ok) {
                const cgData = await cgResponse.json()

                // Map back to token addresses
                Object.entries(tokenIdMap).forEach(([address, coinId]) => {
                  if (cgData[coinId] && cgData[coinId].usd) {
                    priceData[address] = cgData[coinId].usd
                  }
                })
              }
            }
          } catch (cgError) {
            console.warn("CoinGecko API failed:", cgError)
          }
        }

        // Method 3: Fallback to reasonable default prices
        if (Object.keys(priceData).length === 0) {
          console.warn("All price APIs failed, using fallback prices")

          tokenAddresses.forEach((address) => {
            switch (address) {
              case "So11111111111111111111111111111111111111112": // SOL
                priceData[address] = 100
                break
              case "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": // USDC
                priceData[address] = 1
                break
              case "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": // USDT
                priceData[address] = 1
                break
              case "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": // stSOL
                priceData[address] = 105
                break
              case "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": // mSOL
                priceData[address] = 110
                break
              case "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": // JUP
                priceData[address] = 0.8
                break
              case "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": // BONK
                priceData[address] = 0.00002
                break
              case "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3": // PYTH
                priceData[address] = 0.4
                break
              default:
                priceData[address] = 0.1 // Default fallback
            }
          })
        }

        setPrices(priceData)
        console.log("✅ Token prices updated:", priceData)
      } catch (err) {
        console.error("Failed to fetch token prices:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch prices")

        // Even on error, set fallback prices
        const fallbackPrices: Record<string, number> = {}
        tokenAddresses.forEach((address) => {
          if (address === "So11111111111111111111111111111111111111112") {
            fallbackPrices[address] = 100 // SOL
          } else if (address === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") {
            fallbackPrices[address] = 1 // USDC
          } else {
            fallbackPrices[address] = 0.1 // Default
          }
        })
        setPrices(fallbackPrices)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()

    // Refresh prices every 30 seconds (reduced frequency to avoid rate limits)
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [tokenAddresses.join(",")])

  return { prices, loading, error }
}
