"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { QUICKNODE_CONFIG } from "@/lib/config"

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

export function useTokenListFromDAS() {
  const { publicKey } = useWallet()
  const [userTokens, setUserTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!publicKey) {
      setUserTokens([])
      return
    }

    const fetchUserTokens = async () => {
      setLoading(true)
      try {
        // Get user's token accounts using DAS API
        const response = await fetch(QUICKNODE_CONFIG.HTTPS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getAssetsByOwner",
            params: {
              ownerAddress: publicKey.toString(),
              page: 1,
              limit: 1000,
              displayOptions: {
                showFungible: true,
                showNativeBalance: true,
              },
            },
          }),
        })

        const data = await response.json()

        if (data.result?.items) {
          const tokens: Token[] = []

          for (const asset of data.result.items) {
            if (asset.interface === "FungibleToken" && asset.token_info) {
              // Get detailed token metadata
              const metadataResponse = await fetch(QUICKNODE_CONFIG.HTTPS_ENDPOINT, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  jsonrpc: "2.0",
                  id: 1,
                  method: "getAsset",
                  params: {
                    id: asset.id,
                  },
                }),
              })

              const metadataData = await metadataResponse.json()

              if (metadataData.result) {
                const tokenData = metadataData.result
                tokens.push({
                  address: asset.id,
                  symbol: tokenData.content?.metadata?.symbol || "UNKNOWN",
                  name: tokenData.content?.metadata?.name || "Unknown Token",
                  decimals: asset.token_info.decimals || 6,
                  logoURI: tokenData.content?.files?.[0]?.uri,
                })
              }
            }
          }

          setUserTokens(tokens)
        }
      } catch (error) {
        console.error("Failed to fetch user tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserTokens()
  }, [publicKey])

  return { userTokens, loading }
}
