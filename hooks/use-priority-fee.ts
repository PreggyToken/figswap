"use client"

import { useConnection } from "@solana/wallet-adapter-react"
import { QUICKNODE_CONFIG } from "@/lib/config"

export function usePriorityFee() {
  const { connection } = useConnection()

  const getPriorityFee = async () => {
    try {
      const response = await fetch(QUICKNODE_CONFIG.HTTPS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "solana_getPriorityFeeEstimate",
          params: [
            {
              accountKeys: ["JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"], // Jupiter program
              options: {
                includeAllPriorityFeeLevels: true,
              },
            },
          ],
        }),
      })

      const data = await response.json()

      if (data.error) {
        console.warn("Priority fee estimation failed:", data.error)
        return { priorityFeeEstimate: 1000 } // Fallback fee
      }

      return {
        priorityFeeEstimate: data.result?.priorityFeeEstimate || 1000,
      }
    } catch (error) {
      console.warn("Priority fee estimation failed:", error)
      return { priorityFeeEstimate: 1000 } // Fallback fee
    }
  }

  return { getPriorityFee }
}
