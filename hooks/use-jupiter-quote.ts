"use client"

import { useState, useEffect } from "react"
import { JUPITER_CONFIG } from "@/lib/config"

interface UseJupiterQuoteParams {
  inputMint: string
  outputMint: string
  amount: string
  slippageBps: number
}

export function useJupiterQuote({ inputMint, outputMint, amount, slippageBps }: UseJupiterQuoteParams) {
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Reset quote when tokens change
    if (inputMint === outputMint) {
      setQuote(null)
      setError(null)
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setQuote(null)
      setError(null)
      return
    }

    const fetchQuote = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log("🔍 Fetching quote:", {
          from: inputMint,
          to: outputMint,
          amount: amount,
          slippage: slippageBps,
        })

        // Convert amount to lamports based on token decimals
        const inputToken = inputMint === "So11111111111111111111111111111111111111112" ? 9 : 6 // SOL has 9 decimals, most others have 6
        const amountInLamports = Math.floor(Number.parseFloat(amount) * Math.pow(10, inputToken))

        if (amountInLamports <= 0) {
          throw new Error("Invalid amount")
        }

        const params = new URLSearchParams({
          inputMint,
          outputMint,
          amount: amountInLamports.toString(),
          slippageBps: slippageBps.toString(),
        })

        const response = await fetch(`${JUPITER_CONFIG.BASE_URL}/quote?${params}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("❌ Quote API error:", response.status, errorText)
          throw new Error(`Failed to fetch quote: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        console.log("✅ Quote received:", data)
        setQuote(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        console.error("❌ Quote fetch failed:", errorMessage)
        setError(errorMessage)
        setQuote(null)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchQuote, 500)
    return () => clearTimeout(debounceTimer)
  }, [inputMint, outputMint, amount, slippageBps])

  return { quote, loading, error }
}
