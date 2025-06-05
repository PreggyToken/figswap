"use client"

import { useState } from "react"
import { QUICKNODE_CONFIG } from "@/lib/config"

interface TokenMetadata {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  description?: string
  verified?: boolean
}

export function useTokenMetadata() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTokenMetadata = async (tokenAddress: string): Promise<TokenMetadata | null> => {
    if (!tokenAddress || tokenAddress.length < 32) {
      throw new Error("Invalid token address")
    }

    setLoading(true)
    setError(null)

    try {
      console.log("🔍 Fetching token metadata for:", tokenAddress)

      // First try to get token info from QuickNode DAS API
      const response = await fetch(QUICKNODE_CONFIG.HTTPS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getAsset",
          params: {
            id: tokenAddress,
          },
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || "Failed to fetch token metadata")
      }

      if (data.result) {
        const asset = data.result
        const metadata = asset.content?.metadata

        const tokenInfo: TokenMetadata = {
          address: tokenAddress,
          symbol: metadata?.symbol || "UNKNOWN",
          name: metadata?.name || "Unknown Token",
          decimals: asset.token_info?.decimals || 6,
          logoURI: asset.content?.files?.[0]?.uri || metadata?.image,
          description: metadata?.description,
          verified: asset.authorities?.some((auth: any) => auth.scopes?.includes("full")) || false,
        }

        console.log("✅ Token metadata fetched:", tokenInfo)
        return tokenInfo
      }

      // Fallback: try to get basic token info from account data
      const accountResponse = await fetch(QUICKNODE_CONFIG.HTTPS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getAccountInfo",
          params: [
            tokenAddress,
            {
              encoding: "jsonParsed",
            },
          ],
        }),
      })

      const accountData = await accountResponse.json()

      if (accountData.result?.value?.data?.parsed?.info) {
        const info = accountData.result.value.data.parsed.info
        return {
          address: tokenAddress,
          symbol: info.symbol || "UNKNOWN",
          name: info.name || "Unknown Token",
          decimals: info.decimals || 6,
          verified: false,
        }
      }

      throw new Error("Token not found or invalid address")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch token metadata"
      setError(errorMessage)
      console.error("❌ Token metadata fetch failed:", errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { fetchTokenMetadata, loading, error }
}
